import React from "react";
import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import AdminDashboard from "../components/users/admin/AdminDashboard";
import RegisterDoctor from "../components/users/admin/sections/doctorRegistration";
import ManageDoctors from "../components/users/admin/sections/manageDoctors";
import ManagePatients from "../components/users/admin/sections/managePatients";
import Settings from "../components/users/admin/sections/settings";
import SystemReports from "../components/users/admin/sections/system-reports";
import PrescriptionSummaryReport from "../components/users/admin/reports/PrescriptionSummaryReport";
=======
import AdminSidebar from "../components/userLoginRoot/AdminSidebar";
import ManagePatients from "../components/users/admin/sections/ManagePatients";
import ManageDoctors from "../components/users/admin/sections/ManageDoctors";
>>>>>>> main

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
