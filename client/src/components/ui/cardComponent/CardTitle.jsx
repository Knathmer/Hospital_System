import React from 'react';

export const CardTitle = ({ children, className }) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  );
};

export default CardTitle;
