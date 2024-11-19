import React from "react";

const Separator = ({ className = "", ...props }) => {
  return (
    <div
      className={`w-full h-px bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    />
  );
};

export default Separator;
