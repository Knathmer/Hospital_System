import React from "react";

const Label = ({ className = "", children, ...props }) => {
  return (
    <label
      className={` block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

Label.displayName = "Label";

export default Label;
