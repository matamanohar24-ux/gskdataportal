import React from "react";
import Header from "./Header.jsx";

export default function PageShell({ children }) {
  return (
    <div className="container">
      <Header />
      {children}
    </div>
  );
}
