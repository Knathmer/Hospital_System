import React from "react";
import { Info, Trash2 } from "lucide-react";

export default function MedicationCard({
  name,
  instructions,
  prescriptionDetails = {},
  refillDetails = {},
  //   pharmacyDetails = {},
  //   onRequestRefill,
  //   onRemove,
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-pink-600">{name}</h3>
        <button
          className="text-pink-600 hover:text-pink-700"
          aria-label="More information"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div>
          <h4 className="font-semibold text-pink-600">Instructions</h4>
          <p className="break-words overflow-hidden">{instructions}</p>
        </div>
        <div>
          <h4 className="font-semibold text-pink-600">Prescription Details</h4>
          <p>Prescribed {prescriptionDetails.prescribed || "N/A"}</p>
          <p>Approved by {prescriptionDetails.approvedBy || "N/A"}</p>
        </div>
        <div>
          <h4 className="font-semibold text-pink-600">Refill Details</h4>
          <p>Quantity {refillDetails.quantity || "N/A"}</p>
          <p>Day supply {refillDetails.daySupply || "N/A"}</p>
        </div>
        <div>
          <h4 className="font-semibold text-pink-600">Pharmacy Details</h4>
          <p>{"N/A"}</p>
          <p>{"N/A"}</p>
          <p>{"N/A"}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center">
        <button
          //   onClick={onRequestRefill}
          className="text-pink-600 hover:text-pink-700 hover:underline"
        >
          Request refill
        </button>
        <div className="mx-4 h-4 w-px bg-gray-200"></div>
        <button
          //   onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:underline flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Remove
        </button>
      </div>
    </div>
  );
}
