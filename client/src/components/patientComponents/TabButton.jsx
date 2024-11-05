import React from "react";

export default function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 -mb-px border-b-2 font-medium text-sm 
          ${
            isActive
              ? "border-pink-600 text-pink-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } 
          focus:outline-none`}
    >
      {label}
    </button>
  );
}
