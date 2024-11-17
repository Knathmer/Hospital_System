// ChartTooltipContent.jsx
import React from 'react';

export const ChartTooltipContent = ({ payload, label, active }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip-content">
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default ChartTooltipContent;
