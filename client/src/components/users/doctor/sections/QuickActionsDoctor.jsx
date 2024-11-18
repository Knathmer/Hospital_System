import React from "react";
import NavButton from "../../../ui/buttons/NavButton.jsx";

const QuickActionsDoctor = () => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NavButton
          className="bg-blue-500 text-white hover:bg-blue-600"
          to="/doctor/view-schedule"
        >
          View Schedule
        </NavButton>
        <NavButton
          className="bg-blue-500 text-white hover:bg-blue-600"
          to="/doctor/messages"
        >
          Messages
        </NavButton>
        <NavButton
          className="bg-blue-500 text-white hover:bg-blue-600"
          to="/doctor/patient-list"
        >
          Patient List
        </NavButton>
        <NavButton to="/doctor/dashboard?tab=appointments" variant="outline">
          Manage Appointments
        </NavButton>
      </div>
    </section>
  );
};

export default QuickActionsDoctor;
