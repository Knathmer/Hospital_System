import React from "react";

const GenericContainer = ({ children }) => {
  return <div className="bg-white p-6 rounded-lg shadow"> {children}</div>;
};

export default GenericContainer;
