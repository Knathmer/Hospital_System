import React from "react";
import { Clock } from "lucide-react";

export default function PendingRefillCard({ name, status, requestDate }) {
  const getStatusColor = (status) => {
    switch (
      status // Normalize the status to lowercase
    ) {
      case "Pending":
        return "text-yellow-500";
      case "Approved":
        return "text-green-500";
      case "Denied":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
        {/* <p className={`text-sm ${getStatusColor(status)}`}>Status: {status}</p> */}
        <p className="text-sm text-gray-600">Requested on: {requestDate}</p>
      </div>
      <div className={`flex items-center ${getStatusColor(status)}`}>
        <Clock className="w-5 h-5 mr-2 " />
        {status}
      </div>
    </div>
  );
}
