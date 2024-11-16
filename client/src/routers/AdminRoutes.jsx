import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/userLoginRoot/AdminSidebar";
import ManagePatients from "../components/users/admin/sections/ManagePatients";
import ManageDoctors from "../components/users/admin/sections/ManageDoctors";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminSidebar />} />
      <Route path="manage-patients" element={<ManagePatients />} />
      <Route path="manage-doctors" element={<ManageDoctors />} />
      {/* Add other admin routes here */}
    </Routes>
  );
};

export default AdminRoutes;
