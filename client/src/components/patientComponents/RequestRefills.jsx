import React from "react";
import CurrentPrescriptionCard from "./CurrentPrescriptionCard";
import SelectedRefillCard from "./SelectedPrescriptionCard";
import PendingRefillCard from "./PendingRefillCard";
import { Plus } from "lucide-react";
export default function RequestRefills({
  patientsCurrentPrescriptions,
  selectedRefills,
  pendingRequests,
  handleSelectRefill,
  handleUnselectRefill,
  handleRequestRefills,
  refillLoading,
  loading,
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Prescriptions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Current Prescriptions</h2>
          {loading ? (
            <p>Loading current prescriptions...</p>
          ) : patientsCurrentPrescriptions.length > 0 ? (
            patientsCurrentPrescriptions.map((prescription) => (
              <CurrentPrescriptionCard
                key={prescription.prescriptionID}
                name={prescription.medicationName}
                dosage={prescription.dosage}
                frequency={prescription.frequency}
                date={new Date(prescription.start).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
                refillCount={prescription.refillCount}
                prescriptionID={prescription.prescriptionID}
                onSelectRefill={handleSelectRefill}
              />
            ))
          ) : (
            <p>No Medications Available</p>
          )}
        </div>

        {/* Selected Refills */}
        <div>
          <h2 className="text-xl font-bold mb-4">Selected Refills</h2>
          {selectedRefills.length > 0 ? (
            selectedRefills.map((refill) => (
              <SelectedRefillCard
                key={refill.prescriptionID}
                prescriptionID={refill.prescriptionID}
                name={refill.name}
                dosage={refill.dosage}
                frequency={refill.frequency}
                date={refill.date}
                refillCount={refill.refillCount}
                onUnselectRefill={handleUnselectRefill} // Optional: If you want to allow unselecting
              />
            ))
          ) : (
            <p>No Refills Selected</p>
          )}
          <button
            onClick={handleRequestRefills}
            disabled={selectedRefills.length === 0 || refillLoading}
            className="w-full mt-4 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400"
          >
            {refillLoading ? (
              "Submitting..."
            ) : (
              <>
                <Plus className="w-5 h-5 inline mr-2" />
                Request Refills
              </>
            )}
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Pending Refills</h2>
        {!pendingRequests || pendingRequests.length === 0 ? (
          <p className="text-gray-600">
            No pending refill requests currently available.
          </p>
        ) : (
          pendingRequests.map((refill) => (
            <PendingRefillCard
              key={refill.refillID}
              name={refill.medicationName}
              status={refill.status}
              requestDate={new Date(refill.requestDate).toLocaleDateString(
                "en-US",
                {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}
