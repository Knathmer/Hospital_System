import React from "react";

export const CardHeader = ({ children, className }) => {
  return <div className={`border-b p-4 ${className}`}>{children}</div>;
};
