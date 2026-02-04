import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Etl from "./pages/Etl.jsx";
import Analytics from "./pages/Analytics.jsx";
import PageShell from "./components/PageShell.jsx";

export default function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/etl" element={<Etl />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageShell>
  );
}
