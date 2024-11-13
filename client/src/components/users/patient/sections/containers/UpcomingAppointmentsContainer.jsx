import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";

import GenericContainer from "./GenericContainer.jsx";
import NavButton from "../../../../ui/buttons/NavButton.jsx";

const UpcomingAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://localhost:3000/dataFetch/get-appointment-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setAppointments(response.data); 
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments"); 
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <GenericContainer>
      {/* Fixed header */}
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Calendar className="h-5 w-5 text-pink-500 mr-2" />
        Upcoming Appointments
      </h2>
      <ul className="space-y-2">
        <li>
          <span className="font-medium">Annual Check-up</span>
          <br />
          <span className="text-sm text-gray-500">
            May 15, 2024 at 10:00 AM
          </span>
        </li>
        <li>
          <span className="font-medium">Mammogram</span>
          <br />
          <span className="text-sm text-gray-500">June 3, 2024 at 2:00 PM</span>
        </li>
      </ul>
      <NavButton to = "/book" className="mt-4 bg-pink-500 text-white hover:bg-pink-600">
        Schedule Appointment
      </NavButton>
    </GenericContainer>
  );
};

export default UpcomingAppointmentsContainer;
