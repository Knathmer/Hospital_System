import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../components/users/admin/adminDashboard/AdminDashboard";
import RegisterDoctor from "../components/users/admin/sections/doctorRegistration";
import ManageDoctors from "../components/users/admin/sections/manageDoctors/ManageDoctors.jsx";
import ManagePatients from "../components/users/admin/sections/managePatients";
import Settings from "../components/users/admin/sections/settings";
import AppointmentAnalytics from "../components/users/admin/sections/appointmentReport/appointmentAnalytics";
import AdminSidebar from "../components/userLoginRoot/AdminSidebar";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminSidebar />} />
      <Route path="manage-patients" element={<ManagePatients />} />
      <Route path="manage-doctors" element={<ManageDoctors />} />
      <Route path="appointmentAnalytics" element={<AppointmentAnalytics />} />
      <Route path="settings" element={<Settings />} />
      {/* Add other admin routes here */}
    </Routes>
  );
};

export default AdminRoutes;
