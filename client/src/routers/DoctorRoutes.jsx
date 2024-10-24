import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorDashboard from "../components/dashboards/doctor/DoctorDashboard";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DoctorDashboard />} />
      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
