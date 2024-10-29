import React from "react";
import { Routes, Route } from "react-router-dom";
import PatientDashboard from "../components/dashboards/patient/PatientDashboard.tsx";
import MedicationPage from "../pages/patientPages/PatientMedicationPage.jsx";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="medications" element={<MedicationPage />} />
      {/* Add other patient routes here */}
    </Routes>
  );
};

export default PatientRoutes;
