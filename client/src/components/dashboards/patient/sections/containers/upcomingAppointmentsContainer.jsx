import React from "react";
import { Calendar } from "lucide-react";

import GenericContainer from "./GenericContainer.jsx";
import NavButton from "../../../../ui/buttons/navButton.jsx";

const UpcomingAppointmentsContainer = () => {
  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Calendar className="h-5 w-5 text-pink-500 mr-2" />
        Upcoming Appointments
      </h2>
      <ul className="space-y-2">
        <li>
          <span className="font-medium">Annual Check-up</span>
          <br />
          <span className="text-sm text-gray-500">
            May 15, 2024 at 10:00 AM
          </span>
        </li>
        <li>
          <span className="font-medium">Mammogram</span>
          <br />
          <span className="text-sm text-gray-500">June 3, 2024 at 2:00 PM</span>
        </li>
      </ul>
      <NavButton className="mt-4 bg-pink-500 text-white hover:bg-pink-600">
        Schedule Appointment
      </NavButton>
    </GenericContainer>
  );
};

export default UpcomingAppointmentsContainer;
