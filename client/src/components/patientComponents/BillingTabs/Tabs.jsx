import React, { useState } from "react";
import { TabsContext } from "./TabsContext";

//This is the main container component for the entire tabbed interface.
//It wraps all the other tab-related components and manages the overall
//state of which tab is currently active.
export const Tabs = ({ children, defaultValue }) => {
  //Children is the nested component or elements that will be rendered inside of the Tabs component.
  //Default value is the initial value for the active tab.
  const [activeTab, setActiveTab] = useState(defaultValue);

  //Return a context provider, which is used to make the activeTab and setActiveTab available to any nested components in this main container.
  //TabsContext is created elsewhere.
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};
