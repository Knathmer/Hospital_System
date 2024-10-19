import React from "react";

const OnClickButton = ({
  children,
  variant = "default",
  className = "",
  onClick,
  type,
  size = "",
}) => {
  return (
    <button
      className={
        variant == "outline"
          ? `bg-white font-medium px-4 py-2 hover:bg-gray-100 rounded-md display: flex items-center border ${className}`
          : `bg-pink-500 text-white font-medium px-4 py-2 hover:bg-pink-600 rounded-md display: flex items-center ${className}`
      }
      onClick={onClick}
      type={type}
      size={size}
    >
      {children}
    </button>
  );
};

export default OnClickButton;
