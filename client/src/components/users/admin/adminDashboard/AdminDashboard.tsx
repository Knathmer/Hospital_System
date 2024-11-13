// AdminDashboard.js
// import React from 'react';
// import StatsOverview from "./sections/StatsOverview";
// import PatientOverview from "./sections/PatientOverview";
// import ICUvsOPDPatients from "./sections/ICUvsOPDPatients";
// import UpcomingAppointments from "./sections/UpcomingAppointments";
// import DoctorsList from "./sections/DoctorsList";

import ICUvsOPDPatients from "./adminDashboardSections/AnotherChartAdminDB";
import PatientOverview from "./adminDashboardSections/PatientChartAdminDB";
import UpcomingAppointments from "./adminDashboardSections/UpcomingAppointmentDashboardAdminDB";
import StatsOverview from "./adminDashboardSections/HeaderOverview";
import DoctorsList from "./adminDashboardSections/ListOfDoctorsAdminDB";



export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Section 1: Stats Overview */}
      <StatsOverview />

      {/* Section 2 & 3: Patient Overview & ICU vs OPD Patients */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <PatientOverview />
        <ICUvsOPDPatients />
      </div>

      {/* Section 4 & 5: Upcoming Appointments & Doctors List */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <UpcomingAppointments />
        <DoctorsList />
      </div>
    </div>
  );
}
