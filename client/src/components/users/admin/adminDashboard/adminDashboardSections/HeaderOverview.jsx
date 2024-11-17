import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Card from "../../../../ui/cardComponent/Card";
import CardContent from "../../../../ui/cardComponent/CardContent";
import { Users, Smile, Calendar } from "lucide-react";

import envConfig from "../../../../../envConfig";

const StatsOverview = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const responseDoctors = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-total-doctors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Doctors Response:", responseDoctors.data);
        setTotalDoctors(responseDoctors.data.totalDoctors);

        const responsePatients = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-total-patients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Patients Response:", responsePatients.data);
        setTotalPatients(responsePatients.data.totalPatient);

        const responseAdmins = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-total-admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Admins Response:", responseAdmins.data);

        const responseAppointments = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-total-appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Appointments Response:", responseAppointments.data);
        setTotalAppointments(responseAppointments.data.totalAppointments);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Doctors</p>
              <h3 className="text-2xl font-bold">{totalDoctors}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Smile className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Patients
              </p>
              <h3 className="text-2xl font-bold">{totalPatients}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        {" "}
        {/* This makes the Total Appointments card span two columns */}
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Weekly Appointment Count
              </p>
              <h3 className="text-2xl font-bold">{totalAppointments}</h3>
            </div>
          </div>
          {/* Insert additional content here for the expanded Total Appointments card, such as a graph or more data */}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
