import React from "react";

const Select = ({ id, children }) => {
  return <select id={id}> {children}</select>;
};

export default Select;
