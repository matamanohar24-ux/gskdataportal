from typing import Any

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field


DONOR_COL = "donor_signal"
ACCEPTOR_COL = "acceptor_signal"
CONTROL_COL = "control_type"  # POS, NEG, SAMPLE


class TransformRequest(BaseModel):
    columns: list[str] = Field(default_factory=list)
    rows: list[dict[str, Any]] = Field(default_factory=list)


app = FastAPI(title="GSK TR-FRET Backend", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def validate_columns(df: pd.DataFrame) -> None:
    required = {DONOR_COL, ACCEPTOR_COL, CONTROL_COL}
    missing = required - set(df.columns)
    if missing:
        missing_sorted = sorted(missing)
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {missing_sorted}",
        )


def normalize_control_values(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df[CONTROL_COL] = df[CONTROL_COL].astype(str).str.upper().str.strip()
    return df


def background_subtraction(df: pd.DataFrame) -> pd.DataFrame:
    neg_controls = df[df[CONTROL_COL] == "NEG"]
    if neg_controls.empty:
        raise HTTPException(
            status_code=400,
            detail="No NEG control rows found; cannot compute background subtraction.",
        )

    donor_bg = neg_controls[DONOR_COL].mean()
    acceptor_bg = neg_controls[ACCEPTOR_COL].mean()

    df = df.copy()
    df["donor_bg_corrected"] = df[DONOR_COL] - donor_bg
    df["acceptor_bg_corrected"] = df[ACCEPTOR_COL] - acceptor_bg
    return df


def calculate_trfret_ratio(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    donor_safe = df["donor_bg_corrected"].replace(0, np.nan)
    df["trfret_ratio"] = df["acceptor_bg_corrected"] / donor_safe
    return df


def normalize_signal(df: pd.DataFrame) -> tuple[pd.DataFrame, float, float]:
    pos_mean = df[df[CONTROL_COL] == "POS"]["trfret_ratio"].mean()
    neg_mean = df[df[CONTROL_COL] == "NEG"]["trfret_ratio"].mean()

    if pd.isna(pos_mean) or pd.isna(neg_mean):
        raise HTTPException(
            status_code=400,
            detail="POS/NEG controls are required to normalize TR-FRET signal.",
        )

    denominator = pos_mean - neg_mean
    if denominator == 0:
        raise HTTPException(
            status_code=400,
            detail="POS and NEG means are equal; normalization denominator is zero.",
        )

    df = df.copy()
    df["normalized_trfret"] = (df["trfret_ratio"] - neg_mean) / denominator
    return df, float(pos_mean), float(neg_mean)


def calculate_z_prime(df: pd.DataFrame) -> float | None:
    pos = df[df[CONTROL_COL] == "POS"]["trfret_ratio"]
    neg = df[df[CONTROL_COL] == "NEG"]["trfret_ratio"]

    if pos.empty or neg.empty:
        return None

    denominator = abs(pos.mean() - neg.mean())
    if denominator == 0 or pd.isna(denominator):
        return None

    z_prime = 1 - (3 * (pos.std() + neg.std()) / denominator)
    if pd.isna(z_prime):
        return None

    return round(float(z_prime), 3)


def run_trfret_pipeline(payload: TransformRequest) -> tuple[pd.DataFrame, float | None, float, float]:
    if not payload.rows:
        raise HTTPException(status_code=400, detail="Payload 'rows' is empty.")

    try:
        df = pd.DataFrame(payload.rows)
        validate_columns(df)
        df = normalize_control_values(df)

        df = background_subtraction(df)
        df = calculate_trfret_ratio(df)
        df, pos_mean, neg_mean = normalize_signal(df)
        z_prime = calculate_z_prime(df)

        final_cols = [c for c in df.columns if not c.endswith("_signal")]
        clean_df = df[final_cols]
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unexpected transform error: {exc}") from exc

    return clean_df, z_prime, pos_mean, neg_mean


@app.post("/transform/tall-to-wide")
def transform(payload: TransformRequest) -> dict[str, Any]:
    clean_df, z_prime, pos_mean, neg_mean = run_trfret_pipeline(payload)
    clean_df_json = clean_df.replace({np.nan: None})

    return {
        "message": "Transformation successful",
        "input_row_count": int(len(clean_df)),
        "input_columns": payload.columns or list(pd.DataFrame(payload.rows).columns),
        "output_columns": list(clean_df_json.columns),
        "qc_metrics": {
            "z_prime": z_prime,
            "pos_mean_trfret_ratio": round(pos_mean, 6),
            "neg_mean_trfret_ratio": round(neg_mean, 6),
        },
        "sample_output": clean_df_json.head(5).to_dict(orient="records"),
        "data": clean_df_json.to_dict(orient="records"),
    }


@app.post("/transform/trfret/csv")
def transform_trfret_csv(payload: TransformRequest) -> Response:
    clean_df, _, _, _ = run_trfret_pipeline(payload)
    csv_content = clean_df.to_csv(index=False)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=clean_trfret_data.csv"},
    )
