# GSK Backend (FastAPI)

FastAPI backend for TR-FRET transformation. Phase 1 covers ETL transform only.

## Endpoints

- `GET /health`
- `POST /transform/tall-to-wide`
- `POST /transform/trfret/csv`

## Run locally

```bash
cd gsk-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

## Frontend env

In `gsk-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Request payload

```json
{
  "columns": ["plate_id", "well", "sample_id", "donor_signal", "acceptor_signal", "control_type"],
  "rows": [
    {
      "plate_id": "P1",
      "well": "A01",
      "sample_id": "S1",
      "donor_signal": 1200,
      "acceptor_signal": 800,
      "control_type": "NEG"
    }
  ]
}
```

## Transform logic

1. Validate required columns: `donor_signal`, `acceptor_signal`, `control_type`.
2. Use NEG controls for background subtraction.
3. Compute `trfret_ratio = acceptor_bg_corrected / donor_bg_corrected`.
4. Normalize with POS/NEG means.
5. Compute Z-prime QC metric.
6. Return clean data with `_signal` columns removed.

## CSV download endpoint

`POST /transform/trfret/csv` takes the same JSON payload and returns a downloadable CSV file (`clean_trfret_data.csv`).
