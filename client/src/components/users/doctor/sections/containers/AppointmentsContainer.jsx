import React from "react";
import GenericContainer from "./GenericContainer.jsx";
import { Calendar } from "lucide-react";
import NavButton from "../../../../ui/buttons/NavButton.jsx";

const AppointmentsContainer = () => {
  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
        Today's Appointments
      </h2>
      <ul className="space-y-2">
        <li>
          <span className="font-medium">John Doe</span>
          <br />
          <span className="text-sm text-gray-500">10:00 AM - Check-up</span>
        </li>
        <li>
          <span className="font-medium">Jane Smith</span>
          <br />
          <span className="text-sm text-gray-500">11:30 AM - Follow-up</span>
        </li>
      </ul>
      <NavButton to="/doctor/dashboard?tab=appointments" className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
        Manage Appointments
      </NavButton>
    </GenericContainer>
  );
};

export default AppointmentsContainer;
