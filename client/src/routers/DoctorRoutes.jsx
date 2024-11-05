import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorDashboard from "../components/dashboards/doctor/DoctorDashboard";
import DocDashboard from "../components/userSidebarPage/DoctorSidebar";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={< DocDashboard />} />
      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
