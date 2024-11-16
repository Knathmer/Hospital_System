import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../components/users/admin/AdminDashboard";
import RegisterDoctor from "../components/users/admin/sections/doctorRegistration";
import ManageDoctors from "../components/users/admin/sections/manageDoctors";
import ManagePatients from "../components/users/admin/sections/managePatients";
import Settings from "../components/users/admin/sections/settings";
import AppointmentAnalytics from "../components/users/admin/sections/appointmentReport/appointmentAnalytics";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="register-doctor" element={<RegisterDoctor />} />
      <Route path="manage-patients" element={<ManagePatients />} />
      <Route path="manage-doctors" element={<ManageDoctors />} />
      <Route path="appointmentAnalytics" element={<AppointmentAnalytics />} />
      <Route path="settings" element={<Settings />} />
      {/* Add other admin routes here */}
    </Routes>
  );
};

export default AdminRoutes;
