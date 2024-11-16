// client/src/components/users/admin/sections/MultiSelectInput.jsx

import React from 'react';
import Select from 'react-select';

const MultiSelectInput = ({ options, selectedValues, setSelectedValues, label, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">{label}</label>
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
