import React from "react";
import { Routes, Route } from "react-router-dom";

//import PatientSidebar from "../components/dashboards/patient/sidebar/PatientSidebar.jsx";
//import PatientDashboard from "../components/dashboards/patient/PatientDashboard.tsx";
import MedicationPage from "../pages/patientPages/PatientMedicationPage.jsx";
import PatientSidebar from "../components/dashboards/patient/sidebar/patientSidebar.jsx";
import ManagePharmaciesPage from "../pages/patientPages/ManagePharmaciesPage.jsx";
import RefillMedicationsPage from "../pages/patientPages/RefillMedicationPage.jsx";

const PatientRoutes = () => {
  return (
    <Routes>
      {/* <Route path="dashboard" element={<PatientDashboard />} /> */}
      <Route path="dashboard" element={<PatientSidebar />} />

      <Route path="medications">
        <Route index element={<MedicationPage />} />
        <Route path="manage-pharmacies" element={<ManagePharmaciesPage />} />
        <Route path="refill-medications" element={<RefillMedicationsPage />} />
      </Route>
      {/* Add other patient routes here */}
    </Routes>
  );
};

export default PatientRoutes;
