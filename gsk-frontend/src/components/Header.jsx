import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  return (
    <div className="navbar">
      <div className="brand">
        <Link to="/">
          <div style={{display:"flex", alignItems:"baseline", gap:10}}>
            <div className="h1" style={{margin:0}}>GSK Data Portal</div>
          </div>
          <p className="sub">Upload, transform, and explore scientific datasets</p>
        </Link>
      </div>

      <div style={{display:"flex", gap:10}}>
        <Link to="/etl">
          <button className={`btn ${pathname==="/etl" ? "btn-primary":"btn-ghost"}`}>ETL</button>
        </Link>
        <Link to="/analytics">
          <button className={`btn ${pathname==="/analytics" ? "btn-primary":"btn-ghost"}`}>Analytics</button>
        </Link>
      </div>
    </div>
  );
}
