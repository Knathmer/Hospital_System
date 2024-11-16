import React from "react";

const Select = ({ className = "", id, children, ...props }) => {
  return (
    <select
      id={id}
      {...props}
      className={`border  hover:border-pink-500 focus:border-pink-500 focus:ring-pink-500 focus:outline-none focus:cursor- rounded-md px-2 h-10 flex-1 w-full ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
