import React from "react";

const Button = ({ className = "", children, variant = "primary", ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;