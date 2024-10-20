import React from "react";
import { Routes, Route } from "react-router-dom";
import PatientDashboard from "../components/dashboards/PatientDashboard.tsx";
import PrescriptionPage from "../components/patientPages/PrescriptionPage.jsx";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="prescription" element={<PrescriptionPage />} />
      {/* Add other patient routes here */}
    </Routes>
  );
};

export default PatientRoutes;
