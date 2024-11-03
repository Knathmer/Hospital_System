import React from "react";
import { Plus } from "lucide-react";

export default function CurrentPrescriptionCard({
  name,
  dosage,
  frequency,
  date,
  refillCount,
  prescriptionID,
  onSelectRefill,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
        <p className="text-sm text-gray-600">Dosage: {dosage}</p>
        <p className="text-sm text-gray-600">Frequency: {frequency}</p>
        <p className="text-sm text-gray-600">Prescribed on: {date}</p>
        <p className="text-sm text-gray-600">
          Refills remaining: {refillCount}
        </p>
      </div>
      <button
        onClick={() => {
          onSelectRefill({
            name,
            dosage,
            frequency,
            date,
            refillCount,
            prescriptionID,
          });
        }}
        disabled={refillCount === 0}
        className={`bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-colors ${
          refillCount === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
