import React, { useRef } from "react";

export default function FileUpload({ onFileSelected }) {
  const inputRef = useRef(null);

  return (
    <div
      className="card"
      style={{
        border: "2px dashed var(--gsk-orange)",
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.csv"
        style={{ display: "none" }}
        onChange={(e) => onFileSelected(e.target.files[0])}
      />

      <h3>Upload Excel or CSV File</h3>
      <p className="sub">Click to browse and upload your data file</p>
    </div>
  );
}
