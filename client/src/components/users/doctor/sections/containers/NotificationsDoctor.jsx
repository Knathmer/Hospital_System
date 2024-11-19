import React, { useEffect, useState } from "react";
import GenericContainer from "./GenericContainer.jsx";
import { Hospital } from "lucide-react";
import axios from "axios";
import envConfig from "../../../../../envConfig.js";

const OfficeDoc = () => {
  const [office, setOffice] = useState(null);

  useEffect(() => {
    const fetchOffice = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-office-by-doctor`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOffice(response.data);
      } catch (error) {
        console.error("Error fetching office information:", error);
      }
    };

    fetchOffice();
  }, []);

  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Hospital className="h-5 w-5 text-blue-500 mr-2" />
        Office Information
      </h2>
      <div className="max-h-[200px] overflow-y-auto">
        {office ? (
          <ul className="space-y-2">
            <li className="text-sm">
              <strong>Office Name:</strong> {office.officeName}
            </li>
            <li className="text-sm">
              <strong>Address:</strong> {office.address}
            </li>
            <li className="text-sm">
              <strong>Phone:</strong> {office.phone}
            </li>
            <li className="text-sm">
              <strong>Email:</strong> {office.email}
            </li>
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Loading office information...</p>
        )}
      </div>
      {/* <NavButton variant="outline" className="mt-4">
        View More Details
      </NavButton> */}
    </GenericContainer>
  );
};

export default OfficeDoc;
