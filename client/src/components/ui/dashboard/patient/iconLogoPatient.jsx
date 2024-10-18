import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const iconLogoPatient = () => {
  return (
    <Link className="flex items-center justify-center" to="#">
      <User className="h-6 w-6 text-pink-500" />
      <span className="ml-2 text-2xl font-bold text-gray-900">
        PatientPortal
      </span>
    </Link>
  );
};

export default iconLogoPatient;
