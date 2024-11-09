import React, { useContext } from "react";
import { TabsContext } from "./TabsContext";

export const TabsContent = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className="tabs-content">{children}</div>;
};
