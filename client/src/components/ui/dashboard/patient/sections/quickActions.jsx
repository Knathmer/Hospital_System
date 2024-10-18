import React from "react";
import NavButton from "../../../navButton.jsx";

const QuickActions = () => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NavButton className="bg-pink-500 text-white hover:bg-pink-600">
          Request Prescription Refill
        </NavButton>
        <NavButton variant="outline">Message Your Doctor</NavButton>
        <NavButton variant="outline">Update Health Information</NavButton>
        <NavButton variant="outline">View Billing Statements</NavButton>
      </div>
    </section>
  );
};

export default QuickActions;
