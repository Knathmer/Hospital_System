import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    return localStorage.getItem('userRole') || 'patient'; // Default to 'patient'
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;  // Redirect to the login page if not authenticated
  }

  if (!allowedRoles.includes(getUserRole())) {
    return <Navigate to="/forbidden" replace />;  // Redirect to the forbidden page if role is not allowed
  }

  return children;  // If authenticated and role is allowed, render the children (the protected content)
};

export default ProtectedRoute;
