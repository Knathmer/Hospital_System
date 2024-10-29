import React from "react";

const DefaultButton = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  return (
    <button
      className={
        variant == "outline"
          ? `bg-white font-medium px-4 py-2 hover:bg-gray-100 rounded-md inline-block border ${className}`
          : `bg-pink-500 text-white font-medium px-4 py-2 hover:bg-pink-600 rounded-md display: inline-block ${className}`
      }
      {...props}
    >
      {children}
    </button>
  );
};

export default DefaultButton;
