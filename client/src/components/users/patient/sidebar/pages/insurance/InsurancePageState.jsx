import React, { useState, useEffect } from "react";
import axios from "axios";
import EditInsuranceForm from "./EditInsuranceForm";
import InsuranceForm from "./InsuranceForm";

export default function InsurancePage() {
  const [insuranceInfo, setInsuranceInfo] = useState(null); // State to store the insurance data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    const handleInsurance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        // Fetch insurance information from the server
        const response = await axios.get(
          "http://localhost:3000/auth/patient/insurance-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const insuranceInfo = response.data.data;

        // If insurance information exists
        setInsuranceInfo(insuranceInfo);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching insurance info:", error);
      } finally {
        setLoading(false); // Set loading to false after the request finishes
      }
    };

    handleInsurance(); // Call the function to fetch insurance info
  }, []); // Empty dependency array to call only once on component mount

  // Conditional rendering based on the state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (insuranceInfo && insuranceInfo.length > 0) {
    return <EditInsuranceForm />; // If insurance info exists, show edit form
  } else {
    return <InsuranceForm />; // Otherwise, show the form to add insurance
  }
}

//export default InsurancePage;
