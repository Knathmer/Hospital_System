import React from "react";
import { Routes, Route } from "react-router-dom";
import PatientDashboard from "../components/dashboards/patient/PatientDashboard.tsx";
import MedicationPage from "../pages/patientPages/PatientMedicationPage.jsx";
import ManagePharmaciesPage from "../pages/patientPages/ManagePharmaciesPage.jsx";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="medications">
        <Route index element={<MedicationPage />} />
        <Route path="manage-pharmacies" element={<ManagePharmaciesPage />} />
      </Route>

      {/* Add other patient routes here */}
    </Routes>
  );
};

export default PatientRoutes;
