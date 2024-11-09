import React from "react";
import { useNavigate } from "react-router-dom";

const NavButton = ({
  children,
  variant = "default",
  className = "",
  to = "",
  onClick = undefined, // Make onClick optional
}) => {
  const nav = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Call the onClick prop if provided
    }
    if (to) {
      nav(to);
    }
  };

  return (
    <button
      className={
        variant === "outline"
          ? `bg-white font-medium px-4 py-2 hover:bg-gray-100 rounded-md inline-block border ${className}`
          : `bg-pink-500 text-white font-medium px-4 py-2 hover:bg-pink-600 rounded-md inline-block ${className}`
      }
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default NavButton;