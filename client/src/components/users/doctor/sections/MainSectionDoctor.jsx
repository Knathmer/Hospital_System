import React from "react";
import OfficeDoc from "./containers/NotificationsDoctor.jsx";
import AppointmentsContainer from "./containers/AppointmentsContainer.jsx";
import PatientContainer from "./containers/PatientRequestsContainer.jsx";

const MainSectionDoctor = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back {user}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AppointmentsContainer />
        <PatientContainer />
        <OfficeDoc />
      </div>
    </div>
  );
};

export default MainSectionDoctor;