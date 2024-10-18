import React from "react";
import GenericContainer from "./genericContainer";
import { Bell } from "lucide-react";
import Button from "../../../../button";

const NotificationsPatient = () => {
  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Bell className="h-5 w-5 text-pink-500 mr-2" />
        Notifications
      </h2>
      <ul className="space-y-2">
        <li className="text-sm">
          Reminder: Your annual check-up is in 2 weeks
        </li>
        <li className="text-sm">
          New message from Dr. Johnson about your recent lab results
        </li>
      </ul>
      <Button variant="outline" className="mt-4">
        See All Notifications
      </Button>
    </GenericContainer>
  );
};

export default NotificationsPatient;
