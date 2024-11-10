import React from "react";
import NavButton from "../../../ui/buttons/NavButton.jsx";
import DefaultButton from "../../../ui/buttons/DefaultButton.jsx";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const QuickActions = () => {
  const nav = useNavigate();

  const handleInsuranceClick = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }
      // Fetch insurance information from the server (replace with your API endpoint)
      const response = await axios.get(
        "http://localhost:3000/auth/patient/insurance-info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Adjust the endpoint as needed
      const insuranceInfo = await response.data.data;
      console.log(`response.data: ${insuranceInfo[0]}`);

      if (response.data) {
        // Check if insurance info exists
        if (insuranceInfo.length > 0) {
          nav("/edit-insurance"); // Redirect to edit page
        } else {
          nav("/insurance"); // Redirect to form page
        }
      } else {
        // Handle errors (optional)
        console.error("Failed to fetch insurance info", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching insurance info:", error);
    }
  };

  const handleMedHistoryClick = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }
      // Fetch insurance information from the server (replace with your API endpoint)
      const response = await axios.get(
        "http://localhost:3000/auth/patient/medical-history-info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Adjust the endpoint as needed
      const medHistoryInfo = await response.data.data;
      console.log("med-history-info:", medHistoryInfo);
      const entries = Object.values(medHistoryInfo[0]).some(
        (array) => array.length > 0
      );

      if (response.data) {
        // Check if insurance info exists
        if (entries) {
          nav("/edit-medical-history"); // Redirect to edit page
        } else {
          nav("/medical-history"); // Redirect to form page
        }
      } else {
        // Handle errors (optional)
        console.error(
          "Failed to fetch medical history info",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching medical history info:", error);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NavButton
          className="bg-pink-500 text-white hover:bg-pink-600"
          to="/patient/medications"
        >
          Medications
        </NavButton>
        {/* <NavButton variant="outline" >Message Your Doctor</NavButton> */}
        <DefaultButton variant="outline" onClick={handleInsuranceClick}>
          Insurance Information
        </DefaultButton>
        <DefaultButton variant="outline" onClick={handleMedHistoryClick}>
          Update Health Information
        </DefaultButton>
        <NavButton variant="outline" to="/patient/billing">
          View Billing Statements
        </NavButton>
      </div>
    </section>
  );
};

export default QuickActions;
