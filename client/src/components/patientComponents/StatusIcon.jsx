// StatusIcon.jsx
import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function StatusIcon({ status }) {
  switch (status.toLowerCase()) {
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-500 mr-1" />;
    case "approved":
      return <CheckCircle className="w-4 h-4 text-green-500 mr-1" />;
    case "denied":
      return <XCircle className="w-4 h-4 text-red-500 mr-1" />;
    default:
      return null;
  }
}
