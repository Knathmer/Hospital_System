import React from "react";

const Select = ({ className = "", id, children, ...props }) => {
  return (
    <select
      id={id}
      {...props}
      className={`input border-2 hover:border-gray-300 rounded-md px-2 h-10 flex-1 max-w-sm ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
