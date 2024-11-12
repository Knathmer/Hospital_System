import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import DocDashboard from "../components/userLoginRoot/DoctorSidebar";
import PatientInfoPage from '../components/users/doctor/PatientInfoPage.jsx';


const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={< DocDashboard />} />
      <Route path="patient/:patientID" element={<PatientInfoPage />} />
      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
