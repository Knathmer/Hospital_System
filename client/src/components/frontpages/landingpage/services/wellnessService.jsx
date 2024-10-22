import React from "react";
import { Heart } from "lucide-react";

const WellnessService = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <Heart className="h-12 w-12 text-pink-500 mb-4" />
      <h3 className="text-xl font-bold mb-2">Wellness</h3>
      <p className="text-gray-500">
        Holistic approaches to women's health and well-being.
      </p>
    </div>
  );
};

export default WellnessService;
