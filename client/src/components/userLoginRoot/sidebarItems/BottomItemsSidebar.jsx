// This file shows sidebar's user settings and logout buttons
import { Settings, LogOut, ChevronDown, ChevronUp, User } from "lucide-react";
import React, { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/Collapsible";

export default function UserSettingsAndLogout({ activeTab, setActiveTab }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <div className="p-4 border-t">
      {/* <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Account Settings
      </h4> */}
      {/* <button
        onClick={() => setActiveTab('settings')}
        className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
          activeTab === 'settings' ? 'text-pink-600 bg-pink-100' : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Settings className="h-5 w-5 mr-3" />
        Settings
      </button> */}
      <Collapsible
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        className="mb-6"
      >
        <CollapsibleTrigger asChild>
          <button
            variant="ghost"
            //onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab.startsWith("settings")
                ? "text-pink-600 bg-pink-100"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Account Settings
            {isSettingsOpen ? (
              <ChevronUp className="ml-auto h-4 w-4" />
            ) : (
              <ChevronDown className="ml-auto h-4 w-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-8 space-y-2">
          <button
            onClick={() => setActiveTab("settings-personal-info")}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab === "settings-personal-info"
                ? "text-pink-600 bg-pink-100"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <User className="h-5 w-5 mr-3" />
            Personal Info
          </button>
        </CollapsibleContent>
      </Collapsible>

      <button className="flex items-center w-full px-4 py-2 mt-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </button>
    </div>
  );
}
