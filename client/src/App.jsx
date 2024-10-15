import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/protectedroute.jsx'; //Higher-order component or 'guard'. It's basically middleware.
import Forbidden from './components/forbidden.jsx';
import axios from "axios";

// Public routes
import HospitalLandingPage from './components/frontpage/HospitalLandingPage.jsx';
import AboutPage from './components/frontpage/AboutPage.jsx';
import AppointmentsPage from './components/frontpage/AppointmentsPage';
import DoctorsPage from './components/frontpage/DoctorsPage.jsx';
import LoginPage from './components/frontpage/LoginPage.jsx';
import BookPage from './components/frontpage/BookPage.jsx';
import RegistrationPage from './components/frontpage/RegistrationPage.jsx';

// Role-specific route imports
import AdminRoutes from './routers/AdminRoutes.jsx';
import DoctorRoutes from './routers/DoctorRoutes.jsx';
import PatientRoutes from './routers/PatientRoutes.jsx';

import './styles.css'; // This imports tailwind css file.
import WomensHealthLandingPage from './components/frontpage/WomensHealthLandingPage.tsx';

function App() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<WomensHealthLandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/book" element={<BookPage />} />
      <Route path="/register" element={<RegistrationPage />} />

      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}> {/* The 'allowedRoles var doesn't have to match 1-1 with the var name defined in the higher order component. ProtectedRoutes is what actually protects the route . */}
           <AdminRoutes /> {/* This is the actual routing. AKA the child. CHILDREN ARE AUTOMATICALLY PASSED AS ARGUMENTS */}
        </ProtectedRoute>
      } />

      <Route path="/doctor/*" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorRoutes />
        </ProtectedRoute>
      } />

      <Route path="/patient/*" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientRoutes /> 
        </ProtectedRoute>
      } />

      {/* Forbidden route */}
      <Route path="/forbidden" element={<Forbidden />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
