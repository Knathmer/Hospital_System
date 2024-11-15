import React from "react";

const Button = ({
  className = "",
  children,
  variant = "primary",
  disabled = false,
  ...props
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition";
  const variantStyles = {
    primary: `bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed`,
    ghost: `hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed`,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
