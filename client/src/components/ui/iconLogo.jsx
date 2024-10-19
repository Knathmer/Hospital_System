import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const IconLogo = () => {
  return (
    <Link className="flex items-center justify-center" to="#">
      <Heart className="h-6 w-6 text-pink-500 hover:fill-pink-500" />
      <span className="ml-2 text-2xl font-bold text-gray-900 hover:text-pink-500">
        WomenWell
      </span>
    </Link>
  );
};

export default IconLogo;
