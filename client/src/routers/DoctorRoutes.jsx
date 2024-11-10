import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import DocDashboard from "../components/userLoginRoot/DoctorSidebar";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={< DocDashboard />} />
      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
