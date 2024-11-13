import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
  );
};

export const CardHeader = ({ children, className }) => {
  return <div className={`border-b p-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};

export const CardContent = ({ children, ...props }) => {
  return (
    <div {...props} className={`p-4`}>
      {children}
    </div>
  );
};
