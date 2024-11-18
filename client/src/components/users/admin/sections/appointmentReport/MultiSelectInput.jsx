import React from 'react';
import Select from 'react-select';

const MultiSelectInput = ({
  label,
  options,
  selectedValues,
  setSelectedValues,
  placeholder,
  chartToggle,
  chartToggleState,
  setChartToggleState,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        {chartToggle && (
          <input
            type="checkbox"
            checked={chartToggleState}
            onChange={(e) => setChartToggleState(e.target.checked)}
            className="mr-2"
          />
        )}
        <label className="font-semibold">{label}</label>
      </div>
      <Select
        isMulti
        options={options}
        value={selectedValues}
        onChange={setSelectedValues}
        placeholder={placeholder}
        isSearchable
      />
    </div>
  );
};

export default MultiSelectInput;
