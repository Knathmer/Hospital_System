import React from 'react';

const ChartDisplayToggle = ({ label, chartToggleState, setChartToggleState }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={chartToggleState}
          onChange={(e) => setChartToggleState(e.target.checked)}
          className="mr-2"
        />
        <label className="font-semibold">{label}</label>
      </div>
    </div>
  );
};

export default ChartDisplayToggle;
