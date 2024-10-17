import React from "react";
import { Calendar } from "lucide-react";

const ObstetricsService = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <Calendar className="h-12 w-12 text-pink-500 mb-4" />
      <h3 className="text-xl font-bold mb-2">Obstetrics</h3>
      <p className="text-gray-500">
        Expert care throughout your pregnancy journey.
      </p>
    </div>
  );
};

export default ObstetricsService;
