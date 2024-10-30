import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../components/dashboards/admin/AdminDashboard";
import RegisterDoctor from "../components/dashboards/admin/sections/doctorRegistration";
import ManageDoctors from "../components/dashboards/admin/sections/manageDoctors";
import ManagePatients from "../components/dashboards/admin/sections/managePatients";
import Settings from "../components/dashboards/admin/sections/settings";
import SystemReports from "../components/dashboards/admin/sections/system-reports";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="register-doctor" element={<RegisterDoctor />} />
      <Route path="manage-patients" element={<ManagePatients />} />
      <Route path="manage-doctors" element={<ManageDoctors />} />
      <Route path="system-reports" element={<SystemReports />} />
      <Route path="settings" element={<Settings />} />
      {/* Add other admin routes here */}
    </Routes>
  );
};

export default AdminRoutes;
