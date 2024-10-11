import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from "axios";

// Public routes
import HospitalLandingPage from './frontpage/HospitalLandingPage.jsx';
//import HospitalLandingPage2 from './frontpage/HospitalLandingPage2.jsx';
import AboutPage from './frontpage/AboutPage.jsx';
import AppointmentsPage from './frontpage/AppointmentsPage';
import DoctorsPage from './frontpage/DoctorsPage.jsx';
import LoginPage from './frontpage/LoginPage.jsx';
import BookPage from './frontpage/BookPage.jsx';

// Protected routes
import UserDashboard from './dashboards/UserDashboard.jsx';

import '../Styles.css'; // This imports tailwind css file.
import RegistrationPage from './frontpage/RegistrationPage.jsx';

function App() {
  const isAuthenticated = () => {
    // Check if user is authenticated (e.g., by checking for a token in localStorage)
    return localStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    // This should be replaced with actual logic to get the user's role
    return localStorage.getItem('userRole') || 'patient';
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HospitalLandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/book" element={<BookPage />} />
      <Route path="/register" element={<RegistrationPage />} />

      {/* Protected route for user dashboard */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <UserDashboard userRole={getUserRole()} />
        </ProtectedRoute>
      } />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;