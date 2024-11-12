import React from "react";
import UpcomingAppointmentsDashboard from "./containers/UpcomingAppointmentsContainer";
import MedsDashboard from "./containers/MedsContainerDashboard";
import BillingNotificationsPatientDashboard from "./containers/BillingNotificationsPatient";

const MainSectionPatient = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UpcomingAppointmentsDashboard />
        <MedsDashboard />
        <BillingNotificationsPatientDashboard />
      </div>
    </div>
  );
};

export default MainSectionPatient;
