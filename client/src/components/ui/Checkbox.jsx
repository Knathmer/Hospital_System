import React from "react";

const Checkbox = ({ id, ...props }) => {
  return <input type="checkbox" id={id} className="checkbox" {...props} />;
};

export default Checkbox;
