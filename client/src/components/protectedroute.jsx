import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwt_decode(token);
    if (!allowedRoles.includes(decodedToken.role))
      return <Navigate to="/forbidden" />;

    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
