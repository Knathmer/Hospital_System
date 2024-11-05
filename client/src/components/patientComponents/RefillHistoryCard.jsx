import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StatusIcon from "./StatusIcon.jsx";

export default function RefillHistoryCard({
  name,
  status,
  requestDate,
  notes,
  approvedBy,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={toggleExpand}
        className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <StatusIcon status={status} className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600">
                Requested on: {requestDate}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{status}</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        {isExpanded && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {/* Display notes if available */}
              {notes ? (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{notes}</dd>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <dd className="mt-1 text-sm text-gray-900">
                    {status === "Pending"
                      ? "Your request is pending approval."
                      : "No additional notes."}
                  </dd>
                </div>
              )}
              {/* Display Approved By or Denied By */}
              {(status.toLowerCase() === "approved" ||
                status.toLowerCase() === "denied") &&
                approvedBy && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {status === "Approved" ? "Approved By" : "Denied By"}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{approvedBy}</dd>
                  </div>
                )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
