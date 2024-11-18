import React from "react";
import { Routes, Route } from "react-router-dom";

// import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import PatientInfoPage from '../components/users/doctor/PatientInfoPage.jsx';
import DoctorSidebar from "../components/userLoginRoot/DoctorSidebar.jsx";
import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import DocDashboard from "../components/userLoginRoot/DoctorSidebar";
import PatientInfoPage from "../components/users/doctor/PatientInfoPage.jsx";
import DoctorSchedulePage from "../pages/doctorPages/DoctorSchedulePage.jsx";
import AppointmentHandlerPage from "../pages/doctorPages/AppointmentHandlerPage.jsx";
import AppointmentDoctorPage from "../pages/doctorPages/AppointmentDoctorPage.jsx";


const DoctorRoutes = () => {
  return (
    <Routes>

      <Route path="dashboard" element={< DoctorSidebar />} />
      <Route path="patient/:patientID" element={<PatientInfoPage />} />
      <Route path="schedule">
        <Route index element={<DoctorSchedulePage />} />
        <Route
          path="appointments/:appointmentID"
          element={<AppointmentHandlerPage />}
        />
        <Route
          path="appointment/:appointmentID"
          element={<AppointmentDoctorPage />}
        ></Route>
      </Route>

      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
