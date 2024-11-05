import React from "react";
import { Minus } from "lucide-react";

export default function SelectedRefillCard({
  prescriptionID,
  name,
  dosage,
  frequency,
  date,
  refillCount,
  onUnselectRefill,
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
        <p className="text-sm text-gray-600">Dosage: {dosage}</p>
        <p className="text-sm text-gray-600">Frequency: {frequency}</p>
        <p className="text-sm text-gray-600">
          Refills remaining: {refillCount}
        </p>
        <p className="text-sm text-gray-600">Prescribed on: {date}</p>
      </div>
      <button
        className="bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-colors"
        onClick={() => {
          onUnselectRefill(prescriptionID);
        }}
      >
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
}
