import { useEffect, useState } from "react";
import EditMedicalHistoryForm from "./EditMedicalHistoryForm";
import MedicalHistoryForm from "./MedicalHistoryForm";

import axios from "axios";

export default function MedicalHistoryPage() {
  const [medHistoryInfo, setMedHistoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleMedHistory = async () => {
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

        setMedHistoryInfo(medHistoryInfo);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching insurance info:", error);
      } finally {
        setLoading(false); // Set loading to false after the request finishes
      }
    };

    handleMedHistory();
  }, []);

  // Conditional rendering based on the state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const entries = Object.values(medHistoryInfo[0]).some(
    (array) => array.length > 0
  );

  // Check if insurance info exists
  if (entries) {
    return <EditMedicalHistoryForm />; // Redirect to edit page
  } else {
    return <MedicalHistoryForm />; // Redirect to form page
  }
}
