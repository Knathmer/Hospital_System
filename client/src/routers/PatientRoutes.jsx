import React from "react";
import { Routes, Route } from "react-router-dom";
import PatientDashboard from "../components/dashboards/PatientDashboard.tsx";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<PatientDashboard />} />
      {/* Add other patient routes here */}
    </Routes>
  );
};

export default PatientRoutes;
