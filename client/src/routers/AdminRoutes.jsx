import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/userLoginRoot/AdminSidebar";
import ManagePatients from "../components/users/admin/sections/ManagePatients";
import ManageDoctors from "../components/users/admin/sections/ManageDoctors";
import PrescriptionSummaryReport from "../components/users/admin/reports/PrescriptionSummaryReport";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminSidebar />} />
      <Route path="manage-patients" element={<ManagePatients />} />
      <Route path="manage-doctors" element={<ManageDoctors />} />
      {/* Add other admin routes here */}
      <Route
        path="prescription-summary-report"
        element={<PrescriptionSummaryReport />}
      />
    </Routes>
  );
};

export default AdminRoutes;
