import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    return localStorage.getItem('userRole');
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated() && !allowedRoles.includes(getUserRole())) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;

