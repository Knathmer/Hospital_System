import React from "react";
import RefillHistoryCard from "./RefillHistoryCard";

export default function RefillHistory({ refillHistory }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Refill History</h2>
        {refillHistory.length === 0 ? (
          <p className="text-gray-600">
            No pending refill requests currently available.
          </p>
        ) : (
          refillHistory.map((refill) => (
            <RefillHistoryCard
              key={refill.refillID}
              name={refill.medicationName}
              status={refill.status}
              notes={refill.notes}
              approvedBy={refill.firstName + " " + refill.lastName}
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
