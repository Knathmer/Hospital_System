import React, { useState } from "react";
import { Settings, LogOut, ChevronDown, ChevronUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/Collapsible";

export default function UserSettingsAndLogout({ activeTab, setActiveTab }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.setItem("Login", "false"); // Update Login status
    // Optionally, clear other user-related data or reset state here

    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="p-4 border-t">
      {/* Account Settings Collapsible */}
      <Collapsible
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        className="mb-6"
      >
        <CollapsibleTrigger asChild>
          <button
            variant="ghost"
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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-2 mt-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </button>
    </div>
  );
}
