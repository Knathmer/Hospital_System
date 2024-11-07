import React from "react";
import { Info, Trash2 } from "lucide-react";

export default function MedicationCard({
  prescriptionID,
  refillCard,
  name,
  instructions,
  prescriptionDetails = {},
  refillDetails = {},
  pharmacyDetails = {},
  onAssignPharmacy,
  //   onRequestRefill,
  //   onRemove,
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-pink-600">{name}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
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
          {!refillCard ? (
            <>
              <p>Quantity {refillDetails.quantity || "N/A"}</p>
              <p>Day supply {refillDetails.daySupply || "N/A"}</p>
            </>
          ) : (
            <>
              <p>Quantity {refillDetails.quantity || "N/A"}</p>
              <p>Day supply {refillDetails.daySupply || "N/A"}</p>
              <p>
                Refill Count {prescriptionDetails.refillsRemaining} /
                {prescriptionDetails.refillCount}
              </p>
            </>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-pink-600">Pharmacy Details</h4>
          {pharmacyDetails.pharmacyName !== "NULL" ? (
            <>
              <p>
                {pharmacyDetails.pharmacyName} - {pharmacyDetails.pharmacyCity},{" "}
                {pharmacyDetails.pharmacyState}
              </p>
              <p>
                {pharmacyDetails.pharmacyAddress},{" "}
                {pharmacyDetails.pharmacyCity} {pharmacyDetails.pharmacyState}{" "}
                {pharmacyDetails.pharmacyZip}
              </p>
              <p>{pharmacyDetails.pharmacyPhoneNum}</p>
            </>
          ) : (
            <div>
              <p>No pharmacy assigned</p>
              <button
                className="text-pink-600 hover:underline mt-1"
                onClick={onAssignPharmacy}
              >
                Assign Pharmacy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
