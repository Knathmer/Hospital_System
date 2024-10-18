import React from "react";

const OnChangeInput = ({
  className = "",
  placeholder = "",
  type = "",
  id = "",
  isRequired = false,
  value = "",
  onChange,
}) => {
  return (
    <input
      className={`border-2 hover:border-gray-300 rounded-md px-2 ${className}`}
      type={type}
      placeholder={placeholder}
      id={id}
      required={isRequired}
      value={value}
      onChange={onChange}
    />
  );
};

export default OnChangeInput;
