import React from "react";
import Header from "./Header.jsx";

export default function PageShell({ children }) {
  return (
    <div>
      <Header />
      <div className="container">{children}</div>
    </div>
  );
}
