import React from "react";

export default function PharmacyListItem(props) {
  const { pharmacyName, address, city, state, zipCode, phoneNumber } = props;
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-pink-600">{pharmacyName}</h3>
      <p className="text-sm text-gray-600">
        {address}, {city}, {state} {zipCode}
      </p>
      <p className="text-sm text-gray-600">Phone: {phoneNumber}</p>
      {/* Add any actions like edit or delete buttons here */}
    </div>
  );
}
