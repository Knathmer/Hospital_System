import React from "react";

export const CardTitle = ({ children, className }) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};
