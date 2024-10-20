import React from "react";

<<<<<<< HEAD
const Input = ({ className = "", placeholder = "", type = "", ...props }) => {
=======
const Input = ({ className, placeholder, type, value, onChange, ...props }) => {
>>>>>>> main
  return (
    <input
      className={`input border-2 hover:border-gray-300 rounded-md px-2 h-10 flex-1 max-w-sm ${className}`}
      type={type}
      placeholder={placeholder}
<<<<<<< HEAD
=======
      value={value}
      onChange={onChange}
>>>>>>> main
      {...props}
    />
  );
};

export default Input;