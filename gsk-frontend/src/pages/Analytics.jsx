import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*export default function Analytics() {
  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Analytics</h2>
      <p className="sub">
        This page is a placeholder for analytical tasks (summaries, counts, charts, BigQuery views).
      </p>

      <div style={{marginTop:16, padding:16, border:"1px solid var(--border)", borderRadius:12}}>
        <div style={{fontWeight:800}}>Coming Soon</div>
        <div style={{color:"var(--muted)", marginTop:6}}>
          Example future items:
          <ul>
            <li>Protein-level counts</li>
            <li>Distributions of logP / mol_wt</li>
            <li>Top selected molecules</li>
            <li>Export results to CSV</li>
          </ul>
        </div>
      </div>
    </div>
  );
}*/

export default function Analytics() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = (e.dataTransfer?.files || e.target.files)?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="page">
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate("/")}>Back</button>
      </div>
      <div className="page-header">
        <h1>Analytical Tasks</h1>
        <p>Choose an analysis type and upload your dataset to generate insights.</p>
      </div>

      <div className="sub-cards">
        {[
          { id: "summary", title: "Summary Stats", desc: "Mean, median, std-dev and quartiles for every numeric column." },
          { id: "correlation", title: "Correlation Matrix", desc: "Visualise pairwise relationships across variables." },
          { id: "trends", title: "Trend Analysis", desc: "Detect and plot time-series trends and seasonality." },
          { id: "outliers", title: "Outlier Detection", desc: "Flag statistical anomalies using IQR or Z-score." },
        ].map((c) => (
          <div key={c.id} className={`sub-card ${selected === c.id ? "ana" : ""}`} onClick={() => setSelected(c.id)} style={selected === c.id ? { borderColor: "var(--accent)", background: "var(--accent-dim)" } : {}}>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Upload */}
      <div style={{ marginTop: 28 }}>
        <div className="upload-zone" onClick={() => document.getElementById("ana-file-input").click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <input id="ana-file-input" type="file" style={{ display: "none" }} onChange={handleDrop} />
          <div className="upload-icon">Upload</div>
          <p><strong>Drag &amp; drop your file here</strong></p>
          <p className="hint">or click to browse — CSV, XLSX, JSON supported</p>
        </div>
        {file && (
          <div className="file-chip">
            <span style={{ fontSize: 22 }}>📄</span>
            <div>
              <div className="file-chip-name">{file.name}</div>
              <div className="file-chip-size">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button className="file-chip-remove" onClick={() => setFile(null)}>✕</button>
          </div>
        )}
      </div>

      <button className="btn-primary run-analysis" disabled={!file || !selected}>
        {file && selected ? "Run Analysis" : "Select a task & upload a file"}
      </button>
    </div>
  );
}
