import React from "react";

const Label = ({ htmlFor = "default", children, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className={`label ${className}`} {...props}>
        {children}
      </label>
    </div>
  );
};

export default Label;
