import React from 'react';
import Select from 'react-select';

const MultiSelectInput = ({ label, options, selectedValues, setSelectedValues, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="font-semibold block text-gray-700 mb-2">{label}</label>
      <Select
        isMulti
        options={options}
        value={selectedValues}
        onChange={setSelectedValues}
        placeholder={placeholder}
        isSearchable
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default MultiSelectInput;
