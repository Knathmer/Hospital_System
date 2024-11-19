import React, { useEffect, useState } from "react";
import GenericContainer from "./GenericContainer.jsx";
import { Calendar } from "lucide-react";
import NavButton from "../../../../ui/buttons/NavButton.jsx";
import axios from "axios";
import envConfig from "../../../../../envConfig.js";

const AppointmentsContainer = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-doctor-appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
        Today's Appointments
      </h2>
      <ul className="space-y-2 max-h-[200px] overflow-y-auto">
        {appointments.map((appointment, index) => (
          <li key={index} className="border-b pb-2">
            <span className="font-bold text-black">{appointment.status}</span>
            <br />
            <span className="text-sm text-gray-700">{appointment.patientName}</span>
            <br />
            <span className="text-sm text-gray-500">{appointment.time}</span>
            <br />
            <span className="text-sm text-gray-500">{appointment.date}</span>
          </li>
        ))}
      </ul>
      <NavButton
        to="/doctor/dashboard?tab=appointments"
        className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
      >
        Manage Appointments
      </NavButton>
    </GenericContainer>
  );
};

export default AppointmentsContainer;
