import React from "react";
import { Routes, Route } from "react-router-dom";

//import PatientSidebar from "../components/dashboards/patient/sidebar/PatientSidebar.jsx";
//import PatientDashboard from "../components/dashboards/patient/PatientDashboard.tsx";
import MedicationPage from "../pages/patientPages/PatientMedicationPage.jsx";
import PatientSidebar from "../components/userLoginRoot/PatientSidebar.jsx";
import ManagePharmaciesPage from "../pages/patientPages/ManagePharmaciesPage.jsx";
// import RefillMedicationsPage from "../pages/patientPages/RefillMedicationPage.jsx";
import ManageRefillsPage from "../pages/patientPages/ManageRefills.jsx";
import BillingPage from "../pages/patientPages/BillingPage.jsx";

const PatientRoutes = () => {
  return (
    <Routes>
      {/* <Route path="dashboard" element={<PatientDashboard />} /> */}
      <Route path="dashboard" element={<PatientSidebar />} />
      <Route path="dashboard/medications" element={<ManagePharmaciesPage />} />
      <Route
        path="dashboard/manage-pharmacies"
        element={<ManagePharmaciesPage />}
      />
      <Route
        path="dashboard/refill-medications"
        element={<ManageRefillsPage />}
      />

      <Route path="medications">
        <Route index element={<MedicationPage />} />
        <Route path="manage-pharmacies" element={<ManagePharmaciesPage />} />
        <Route path="refill-medications" element={<ManageRefillsPage />} />
      </Route>
      <Route path="billing" element={<BillingPage />} />
      {/* Add other patient routes here */}
    </Routes>
  );
};

export default PatientRoutes;
