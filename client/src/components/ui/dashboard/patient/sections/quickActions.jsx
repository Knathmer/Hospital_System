import React from "react";
import Button from "../../../button.jsx";

const QuickActions = () => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button className="bg-pink-500 text-white hover:bg-pink-600">
          Request Prescription Refill
        </Button>
        <Button variant="outline">Message Your Doctor</Button>
        <Button variant="outline">Update Health Information</Button>
        <Button variant="outline">View Billing Statements</Button>
      </div>
    </section>
  );
};

export default QuickActions;
