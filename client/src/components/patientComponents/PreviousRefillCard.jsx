import React from "react";

export default function PreviousRefillCard({ name, status, requestDate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "denied":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
      <p className={`text-sm ${getStatusColor(status)}`}>Status: {status}</p>
      <p className="text-sm text-gray-600">Requested on: {requestDate}</p>
    </div>
  );
}
