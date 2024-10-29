import React from "react";

const Input = ({ className = "", placeholder = "", type = "", ...props }) => {
  return (
    <input
      className={`input border-2 hover:border-gray-300 rounded-md px-2 h-10 flex-1 w-full ${className}`}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
