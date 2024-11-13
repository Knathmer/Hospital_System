// ChartContainer.jsx
import React from 'react';

export const ChartContainer = ({ config, children, className }) => {
  return (
    <div className={`chart-container ${className}`}>
      {Object.keys(config).map((key) => (
        <div key={key} className="chart-legend">
          <span className="chart-color" style={{ backgroundColor: `var(--color-${key})` }}></span>
          <span>{config[key].label}</span>
        </div>
      ))}
      {children}
    </div>
  );
};

export default ChartContainer;