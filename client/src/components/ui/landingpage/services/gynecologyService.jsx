import React from "react";
import { Users } from "lucide-react";

const GynecoloyService = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <Users className="h-12 w-12 text-pink-500 mb-4" />
      <h3 className="text-xl font-bold mb-2">Gynecology</h3>
      <p className="text-gray-500">
        Comprehensive care for all your gynecological needs.
      </p>
    </div>
  );
};

export default GynecoloyService;
