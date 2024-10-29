import React from 'react';

export default function SidebarToggleButton({ isSidebarVisible, toggleSidebar }) {
  return (
    <button
      onClick={toggleSidebar}
      className={`absolute top-4 transform p-2 rounded-r-lg bg-pink-500 text-white focus:outline-none transition-transform duration-300 ${
        isSidebarVisible ? 'left-64' : 'left-0'
      }`}
      title={isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
    >
      {isSidebarVisible ? '<' : '>'}
    </button>
  );
}
