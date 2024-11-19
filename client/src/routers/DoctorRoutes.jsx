import React from "react";
import { Routes, Route } from "react-router-dom";
// import DoctorBookingPage from "../components/users/doctor/DoctorBookingPage";
import PatientInfoPage from "../components/users/doctor/PatientInfoPage.jsx";
import DoctorSidebar from "../components/userLoginRoot/DoctorSidebar.jsx";
import DoctorSchedulePage from "../pages/doctorPages/DoctorSchedulePage.jsx";
import AppointmentPage from "../pages/doctorPages/AppointmentDoctorPage.jsx";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DoctorSidebar />} />
      <Route path="patient/:patientID" element={<PatientInfoPage />} />
      <Route path="schedule">
        <Route index element={<DoctorSchedulePage />} />
        <Route
          path="appointment/:appointmentID"
          element={<AppointmentPage />}
        />
      </Route>
      {/* Add other doctor routes here */}
    </Routes>
  );
};

export default DoctorRoutes;
