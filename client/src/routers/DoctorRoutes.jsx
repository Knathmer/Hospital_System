import React from "react";
import { Routes, Route } from "react-router-dom";
// import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import PatientInfoPage from '../components/users/doctor/PatientInfoPage.jsx';
import DoctorSidebar from "../components/userLoginRoot/DoctorSidebar.jsx";


const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={< DoctorSidebar />} />
      <Route path="patient/:patientID" element={<PatientInfoPage />} />
      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
