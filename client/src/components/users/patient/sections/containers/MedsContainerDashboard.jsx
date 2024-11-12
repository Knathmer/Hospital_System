import React, { useEffect, useState } from "react";
import axios from "axios";
import { PillBottle } from "lucide-react";

import GenericContainer from "./GenericContainer.jsx";
import NavButton from "../../../../ui/buttons/NavButton.jsx";

const MedsDashboard = () => {
  const [testResults, setTestResults] = useState([]); // State for test results
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/dataFetch/get-meds-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        console.log("Fetched test results:", response.data); 
        setTestResults(response.data); 
      } catch (error) {
        console.error("Error fetching test results:", error.response || error);
        setError("Failed to fetch medication results");
      } finally {
        setLoading(false);
      }
    };
  
    fetchTestResults();
  }, []);

  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <PillBottle className="h-5 w-5 text-pink-500 mr-2" />
        Medication Status
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : testResults.length > 0 ? (
        <ul className="space-y-2">
          {testResults.map((result, index) => (
            <li key={index}>
              <span className="text-sm text-gray-500">
                Status: {result.status}
              </span>
              <br />
              <span className="text-sm text-gray-500">
                Request Date: {new Date(result.requestDate).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No recent medication requests</p>
      )}

      <NavButton variant="outline" className="mt-4">
        View All Results
      </NavButton>
    </GenericContainer>
  );
};

export default MedsDashboard;
