import React from "react";
import { Routes, Route } from "react-router-dom";
// import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import AdminSidebar from "../components/userLoginRoot/AdminSidebar.jsx";
import PatientInfoPage from '../components/users/doctor/PatientInfoPage.jsx';


const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={< AdminSidebar />} />
      <Route path="patient/:patientID" element={<PatientInfoPage />} />
      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
