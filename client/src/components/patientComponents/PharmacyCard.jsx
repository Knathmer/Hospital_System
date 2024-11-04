import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function PharmacyListItem({
  pharmacyID,
  pharmacyName,
  address,
  city,
  state,
  zipCode,
  phoneNumber,
  onRemove,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    if (showConfirm) {
      onRemove(pharmacyID);
    } else {
      setShowConfirm(true);
    }
  };
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-pink-600">
            {pharmacyName}
          </h3>
          <p className="text-sm text-gray-600">
            {address}, {city}, {state} {zipCode}
          </p>
          <p className="text-sm text-gray-600">Phone: {phoneNumber}</p>
        </div>
        <button
          className="text-red-500 hover:text-red-600 transition-colors"
          aria-label="Remove pharmacy"
          onClick={handleRemove}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      {showConfirm && (
        <div className="mt-2">
          <p className="text-sm text-red-600">
            Are you sure you want to remove this pharmacy?
          </p>
          <div className="flex space-x-2 mt-2">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onRemove(pharmacyID)}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
