import React from "react";
import { PlusCircle } from "lucide-react";

export default function NoMedicationsCard() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold text-pink-600 mb-4">
          No Medications Found
        </h3>
        <p className="text-gray-600 mb-6">
          You currently have no medications listed. If you need to add a
          medication, please click the button below.
        </p>
        <button className="inline-flex items-center justify-center rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-700 disabled:pointer-events-none disabled:opacity-50">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Medication
        </button>
      </div>
    </div>
  );
}
