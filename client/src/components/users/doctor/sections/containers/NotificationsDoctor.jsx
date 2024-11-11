import React from "react";
import GenericContainer from "./GenericContainer.jsx";
import { Bell } from "lucide-react";
import NavButton from "../../../../ui/buttons/NavButton.jsx";

const NotificationsDoctor = () => {
  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Bell className="h-5 w-5 text-blue-500 mr-2" />
        Notifications
      </h2>
      <ul className="space-y-2">
        <li className="text-sm">
          Reminder: Review the lab results for Patient A.
        </li>
        <li className="text-sm">
          New appointment request from Patient B.
        </li>
        <li className="text-sm">
          Team meeting scheduled for May 18th at 3 PM.
        </li>
      </ul>
      <NavButton variant="outline" className="mt-4">
        View All Notifications
      </NavButton>
    </GenericContainer>
  );
};

export default NotificationsDoctor;
