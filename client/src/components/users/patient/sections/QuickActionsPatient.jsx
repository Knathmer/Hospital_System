import React from "react";
import NavButton from "../../../ui/buttons/NavButton.jsx";
import DefaultButton from "../../../ui/buttons/DefaultButton.jsx";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const nav = useNavigate();

  const handleInsuranceClick = () => {
    nav("/patient/dashboard?tab=insurance");
  };

  const handleMedHistoryClick = () => {
    nav("/patient/dashboard?tab=medical-records");
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NavButton
          className="bg-pink-500 text-white hover:bg-pink-600"
          to="/patient/dashboard?tab=medications"
        >
          Medications
        </NavButton>
        {/* <NavButton variant="outline" >Message Your Doctor</NavButton> */}
        <DefaultButton variant="outline" onClick={handleInsuranceClick}>
          Insurance Information
        </DefaultButton>
        <DefaultButton variant="outline" onClick={handleMedHistoryClick}>
          Update Medical History
        </DefaultButton>
        <NavButton variant="outline" to="/patient/billing">
          View Billing Statements
        </NavButton>
      </div>
    </section>
  );
};

export default QuickActions;
