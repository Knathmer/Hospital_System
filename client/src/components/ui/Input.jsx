import React from "react";

const Input = ({ className = "", placeholder = "", type = "", ...props }) => {
  return (
    <input
      className={` border  hover:border-pink-500 focus:border-pink-500 focus:ring-pink-500 focus:outline-none focus:cursor- rounded-md px-2 h-10 flex-1 w-full ${className}`}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
