import React from "react";

const Input = ({ className, placeholder, type, value, onChange, ...props }) => {
  return (
    <input
      className={`border-2 hover:border-gray-300 rounded-md px-2 ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default Input;