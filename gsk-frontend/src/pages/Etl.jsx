import React, { useState } from "react";
import * as XLSX from "xlsx";
import FileUpload from "../components/FileUpload.jsx";
import DataPreview from "../components/DataPreview.jsx";

export default function Etl() {
  const [previewData, setPreviewData] = useState([]);
  const [uploaded, setUploaded] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json(sheet);
    setPreviewData(jsonData.slice(0, 5));
    setUploaded(true);
    console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);


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

      <DataPreview rows={previewData} />
    </div>
  );
}
