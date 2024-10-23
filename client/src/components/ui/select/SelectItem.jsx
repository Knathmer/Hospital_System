import React from "react";

const SelectItem = ({ value = "default", children = "", ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};

export default SelectItem;
