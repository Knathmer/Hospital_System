import React from "react";
import { Routes, Route } from "react-router-dom";
// import PatientDashboard from "../components/dashboards/patient/PatientDashboard.tsx";
import PatientSidebar from "../components/userSidebarPage/PatientSidebar.jsx";

const PatientRoutes = () => {
  return (
    <Routes>
      {/* <Route path="dashboard" element={<PatientDashboard />} /> */}
      <Route path="dashboard" element={<PatientSidebar />} />
      {/* Add other patient routes here */}
    </Routes>
  );
};

export default PatientRoutes;
