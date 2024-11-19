import React, { useEffect, useState } from "react";
import GenericContainer from "./GenericContainer.jsx";
import { UserPlus } from "lucide-react";
import axios from "axios";
import envConfig from "../../../../../envConfig.js";

const PatientContainer = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage

        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-patients-by-doctor`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <UserPlus className="h-5 w-5 text-blue-500 mr-2" />
        Patient Requests
      </h2>
      {/* Scrollable list */}
      <ul className="space-y-2 max-h-[200px] overflow-y-auto">
        {patients.map((patient, index) => (
          <li key={index} className="border-b pb-2">
            <p className="font-medium text-sm text-gray-700">{patient.patientName}</p>
            <p className="text-sm text-gray-500">
              {patient.isPrimary} Patient
            </p>
          </li>
        ))}
      </ul>
    </GenericContainer>
  );
};

export default PatientContainer;
