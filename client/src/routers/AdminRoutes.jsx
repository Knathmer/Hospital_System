import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      {/* Add other admin routes here */}
    </Routes>
  );
};

export default AdminRoutes;
