import React, { useState, useEffect } from "react";
import axios from "axios";

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "http://localhost:3000/auth/patient/prescription",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Access the prescription array correctly
        setPrescriptions(
          Array.isArray(response.data.patientMedications)
            ? response.data.patientMedications
            : []
        );
        setLoading(false);
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message
            : "Error Fetching prescription"
        );
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return <p>Loading prescriptions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Prescription Information</h1>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <ul>
          {prescriptions.map((prescription, index) => (
            <li key={index}>
              <p>
                <strong>Medication Name: </strong>
                {prescription.medicationName}
              </p>
              <p>
                <strong>Dosage: </strong>
                {prescription.dosage}
              </p>
              <p>
                <strong>Frequency: </strong>
                {prescription.frequency}
              </p>
              <p>
                <strong>Instructions: </strong>
                {prescription.instructions}
              </p>
              <p>
                <strong>Start Date: </strong>
                {prescription.startDate}
              </p>
              <p>
                <strong>End Date: </strong>
                {prescription.endDate}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionPage;
