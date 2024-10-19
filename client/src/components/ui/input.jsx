import React from "react";

const Input = ({
  className = "",
  placeholder = "",
  type = "",
  id = "",
  isRequired = false,
  value = "",
}) => {
  return (
    <input
      className={`border-2 hover:border-gray-300 rounded-md px-2 h-10 ${className}`}
      type={type}
      placeholder={placeholder}
      id={id}
      required={isRequired}
      value={value}
    />
  );
};

export default Input;
