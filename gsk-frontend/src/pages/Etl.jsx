import React, { useState } from "react";
import * as XLSX from "xlsx";
import FileUpload from "../components/FileUpload.jsx";
import DataPreview from "../components/DataPreview.jsx";
import { api } from "../api/client.js";

export default function Etl() {
  const [previewData, setPreviewData] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [transformResult, setTransformResult] = useState(null);
  const [transformError, setTransformError] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json(sheet);
    setPreviewData(jsonData.slice(0, 5));
    setUploaded(true);
    setTransformError(null);
    setTransformResult(null);

    try {
      const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
      const response = await api.post("/transform/tall-to-wide", {
        columns,
        rows: jsonData,
      });
      setTransformResult(response.data);
    } catch (err) {
      setTransformError("Backend transform failed. Check server logs and CORS.");
    }
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>ETL Transformations</h2>
        <p className="sub">
          Upload a dataset to preview and prepare it for backend transformations.
        </p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <FileUpload onFileSelected={handleFileUpload} />
      </div>

      {uploaded && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            borderRadius: "10px",
            background: "#ecfdf3",
            border: "1px solid #bbf7d0",
            color: "#166534",
            fontWeight: 600,
          }}
        >
          ✔ Your data is uploaded successfully
        </div>
      )}

      {transformResult && (
        <div className="card" style={{ marginTop: "16px" }}>
          <h3 style={{ marginTop: 0 }}>Backend Response</h3>
          <div><strong>Message:</strong> {transformResult.message}</div>
          <div><strong>Input rows:</strong> {transformResult.input_row_count}</div>
        </div>
      )}

      {transformError && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            borderRadius: "10px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontWeight: 600,
          }}
        >
          {transformError}
        </div>
      )}

      <DataPreview rows={previewData} />
    </div>
  );
}
