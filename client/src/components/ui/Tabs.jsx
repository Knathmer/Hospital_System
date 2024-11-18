import React, { useContext, useState } from "react";

export const TabsContext = React.createContext();

//This is the main container component for the entire tabbed interface.
//It wraps all the other tab-related components and manages the overall
//state of which tab is currently active.
export const Tabs = ({ children, defaultValue, onTabChange, ...props }) => {
  //Children is the nested component or elements that will be rendered inside of the Tabs component.
  //Default value is the initial value for the active tab.
  const [activeTab, setActiveTab] = useState(defaultValue);
  // Notify parent component when the tab changes
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (onTabChange) {
      onTabChange(newTab); // Call parent function when tab changes
    }
  };

  //Return a context provider, which is used to make the activeTab and setActiveTab available to any nested components in this main container.
  //TabsContext is created elsewhere.
  return (
    <TabsContext.Provider
      {...props}
      value={{ activeTab, setActiveTab: handleTabChange }}
    >
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

// Represents a single tab button that switches to the corresponding content when clicked.
export const TabsTrigger = ({ value, children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  const handleClick = () => {
    setActiveTab(value);
  };

  const isActive = activeTab === value;

  return (
    <button
      {...props}
      className={` flex items-center justify-center py-1 ${
        isActive
          ? "bg-white text-pink-700 font-semibold rounded-sm"
          : "text-gray-500 font-semibold"
      }`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className="tabs-content ">{children}</div>;
};

export const TabsList = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className=" grid w-full grid-cols-2 justify-center bg-pink-100 p-1 rounded-lg"
    >
      {children}
    </div>
  );
};
