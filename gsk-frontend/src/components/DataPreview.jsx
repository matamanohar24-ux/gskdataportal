import React from "react";

export default function DataPreview({ rows }) {
  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]);

  return (
    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Preview: First 5 Rows</h3>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    background: "var(--gsk-orange)",
                    color: "white",
                    padding: "8px",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      border: "1px solid var(--border)",
                      padding: "8px",
                    }}
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
