import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import DocDashboard from "../components/userLoginRoot/DoctorSidebar";
import PatientInfoPage from "../components/users/doctor/PatientInfoPage.jsx";
import DoctorSchedulePage from "../pages/doctorPages/DoctorSchedulePage.jsx";
import AppointmentHandlerPage from "../pages/doctorPages/AppointmentHandlerPage.jsx";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DocDashboard />} />
      <Route path="patient/:patientID" element={<PatientInfoPage />} />
      <Route path="schedule">
        <Route index element={<DoctorSchedulePage />} />
        <Route
          path="appointments/:appointmentID"
          element={<AppointmentHandlerPage />}
        />
      </Route>

      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
