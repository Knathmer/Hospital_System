import React from "react";

export default function SelectedRefillCard({
  name,
  dosage,
  frequency,
  date,
  refillCount,
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
      <p className="text-sm text-gray-600">Dosage: {dosage}</p>
      <p className="text-sm text-gray-600">Frequency: {frequency}</p>
      <p className="text-sm text-gray-600">Refills remaining: {refillCount}</p>
      <p className="text-sm text-gray-600">Prescribed on: {date}</p>
    </div>
  );
}
