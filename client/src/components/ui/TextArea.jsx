import React from "react";

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`input border-2 hover:border-gray-300 rounded-md px-2 h-24 min-w-full flex-1 ${className}`}
      {...props}
    ></textarea>
  );
};

export default Textarea;
