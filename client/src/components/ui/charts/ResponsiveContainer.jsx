import React from 'react';

const ResponsiveContainer = ({ width, height, children }) => {
  return (
    <div style={{ width, height }}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;