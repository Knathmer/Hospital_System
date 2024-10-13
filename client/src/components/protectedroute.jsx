import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  //Verify that they are 1. Authenticated 2. Have a role
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    return localStorage.getItem('userRole');
  };
  //Handle if there is 1. No Authentication 2. Role Mismatch
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(getUserRole())) {
    return <Navigate to="/forbidden" replace />;  // replace prevents users from using back arrow to get back to unauthorized page. Removes it from history stack.
  }

  return children; // Move to protected route
};

export default ProtectedRoute;
