import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../components/users/admin/AdminDashboard";
import RegisterDoctor from "../components/users/admin/sections/doctorRegistration";
import ManageDoctors from "../components/users/admin/sections/manageDoctors";
import ManagePatients from "../components/users/admin/sections/managePatients";
import Settings from "../components/users/admin/sections/settings";
import SystemReports from "../components/users/admin/sections/system-reports";
import PrescriptionSummaryReport from "../components/users/admin/reports/PrescriptionSummaryReport";

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
      <Route
        path="prescription-summary-report"
        element={<PrescriptionSummaryReport />}
      />
    </Routes>
  );
};

export default AdminRoutes;
