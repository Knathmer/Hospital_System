import React, { useEffect, useState } from "react";
import axios from "axios";
import { PillBottle } from "lucide-react";

import GenericContainer from "./GenericContainer.jsx";
import NavButton from "../../../../ui/buttons/NavButton.jsx";

const MedsContainer = () => {
  const [testResults, setTestResults] = useState([]); // State for test results
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // useEffect(() => {
  //   const fetchTestResults = async () => {
  //     try {
  //       const token = localStorage.getItem("token"); // Retrieve token from localStorage
  //       const response = await axios.get("http://localhost:3000/dataFetch/get-meds-dashboard", {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Include token in headers for authorization
  //         },
  //       });
  //       setTestResults(response.data); // Update testResults state with the fetched data
  //     } catch (error) {
  //       console.error("Error fetching test results:", error);
  //       setError("Failed to fetch test results"); // Set error message if request fails
  //     } finally {
  //       setLoading(false); // Set loading to false after request completes
  //     }
  //   };

  //   fetchTestResults(); // Call fetchTestResults when component mounts
  // }, []);
  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/dataFetch/get-meds-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched test results:", response.data); // Log response data
        setTestResults(response.data); // Update state with fetched data
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
              <span className="font-medium">{result.medicationName}</span>
              <br />
              <span className="text-sm text-gray-500">
                Status: {result.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No recent test results</p>
      )}

      <NavButton variant="outline" className="mt-4">
        View All Results
      </NavButton>
    </GenericContainer>
  );
  
};

export default MedsContainer;
