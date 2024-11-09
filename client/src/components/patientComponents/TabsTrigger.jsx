import React, { useContext } from "react";
import { TabsContext } from "./TabsContext";

// Represents a single tab button that switches to the corresponding content when clicked.
export const TabsTrigger = ({ value, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  const handleClick = () => {
    setActiveTab(value);
  };

  const isActive = activeTab === value;

  return (
    <button
      className={`tabs-trigger ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
