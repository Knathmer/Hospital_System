import React from 'react';

export const CardHeader = ({ children, className }) => {
  return (
    <div className={`pb-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default CardHeader;
