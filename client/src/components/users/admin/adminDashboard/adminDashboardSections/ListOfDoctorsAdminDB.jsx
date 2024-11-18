import React, { useEffect, useState } from "react";
import { Card } from "../../../../patientComponents/BillingCards/Card";
import { CardHeader } from "../../../../patientComponents/BillingCards/CardHeader";
import { CardTitle } from "../../../../patientComponents/BillingCards/CardTitle";
import { CardContent } from "../../../../patientComponents/BillingCards/CardContent";
import axios from "axios";

import envConfig from "../../../../../envConfig";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-doctors-list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors list:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Doctors List</CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-[300px] overflow-y-auto">
        <div className="space-y-4">
          {doctors.map((doctor, index) => (
            <div key={index} className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium leading-none">
                  Dr. {doctor.name}
                </p>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorsList;
