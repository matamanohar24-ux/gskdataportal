import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  return (
    <div className="nav-shell">
      <div className="navbar">
        <div className="brand">
          <Link to="/" className="brand-link">
            <div className="logo-row">
              <span className="gsk-mark">GSK</span>
              <span className="brand-title">Data Portal</span>
            </div>
            <div className="brand-sub">Upload, transform, and explore scientific datasets</div>
          </Link>
        </div>

        <div className="nav-actions">
          <Link to="/etl">
            <button className={`btn ${pathname==="/etl" ? "btn-primary":"btn-ghost"}`}>ETL</button>
          </Link>
          <Link to="/analytics">
            <button className={`btn ${pathname==="/analytics" ? "btn-primary":"btn-ghost"}`}>Analytics</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
