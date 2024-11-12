import React from "react";
import GenericContainer from "./GenericContainer.jsx";
import { UserPlus } from "lucide-react";
import NavButton from "../../../../ui/buttons/NavButton.jsx";

const PatientRequestsContainer = () => {
  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <UserPlus className="h-5 w-5 text-blue-500 mr-2" />
        Patient Requests
      </h2>
      <ul className="space-y-2">
        <li>
          <span className="font-medium">Mary Johnson</span>
          <br />
          <span className="text-sm text-gray-500">
            Request for consultation approval.
          </span>
        </li>
        <li>
          <span className="font-medium">Michael Brown</span>
          <br />
          <span className="text-sm text-gray-500">
            Request for medical history update review.
          </span>
        </li>
      </ul>
      <NavButton to="/doctor/patient-requests" className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
        View All Requests
      </NavButton>
    </GenericContainer>
  );
};

export default PatientRequestsContainer;
