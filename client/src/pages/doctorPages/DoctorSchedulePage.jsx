import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

export default function DoctorSchedulePage() {
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [updatedAppointments, setUpdatedAppointments] = useState(new Set());

  const navigate = useNavigate();

  //-----------Fetch Todays Doctor Schedule-----------------\\
  const fetchTodaysSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/auth/doctor/schedule",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodaysSchedule(response.data.doctorSchedule || []);
    } catch (error) {
      console.error("Error fetching doctor's schedule:", error);
    }
  };

  useEffect(() => {
    fetchTodaysSchedule();
  }, []);

  //---------------------------------------------------------
  const proceedToAppointment = (appointmentID) => {
    navigate(`/doctor/schedule/appointment/${appointmentID}`);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Back Arrow */}
      <div>
        <button
          onClick={() => navigate("/doctor/dashboard")}
          className="text-pink-600 hover:text-pink-700 flex items-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Today's Schedule</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todaysSchedule && todaysSchedule.length > 0 ? (
            todaysSchedule.map((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDateTime);
              const currentTime = new Date();

              // Determine if it is on the same day
              const isSameDay =
                currentTime.toDateString() === appointmentDate.toDateString();

              // Appointment times
              const timeOfAppointment = appointmentDate.toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              );

              // Conditions
              const isBeforeAppointment = currentTime < appointmentDate;
              const isAfterAppointment =
                currentTime > appointmentDate && isSameDay;

              return (
                <React.Fragment key={appointment.appointmentID}>
                  <TableRow>
                    <TableCell>{appointment.fullName}</TableCell>
                    <TableCell>{timeOfAppointment}</TableCell>
                    <TableCell>{appointment.serviceName}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {isAfterAppointment ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              proceedToAppointment(appointment.appointmentID)
                            }
                          >
                            Proceed with Appointment
                          </Button>
                        ) : (
                          <Button variant="primary" size="sm" disabled>
                            {isBeforeAppointment
                              ? "Upcoming Appointment"
                              : "Appointment Expired"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No schedule for today
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
