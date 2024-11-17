import React from 'react';

const PieChart = ({ children }) => {
  return (
    <svg className="pie-chart">
      {children}
    </svg>
  );
};

export default PieChart;