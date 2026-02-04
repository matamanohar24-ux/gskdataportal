import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="grid-2">
      <div className="big-action card">
        <h2>Transform your data</h2>
        <p>
          Upload a dataset and run simple backend transformations 
        </p>
        <div style={{marginTop:"auto"}}>
          <button className="btn btn-primary" onClick={() => nav("/etl")}>
            Go to ETL
          </button>
        </div>
      </div>

      <div className="big-action card">
        <h2>Analytics</h2>
        <p>
          Explore and summarize processed data. 
        </p>
        <div style={{marginTop:"auto"}}>
          <button className="btn btn-primary" onClick={() => nav("/analytics")}>
            Go to Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
