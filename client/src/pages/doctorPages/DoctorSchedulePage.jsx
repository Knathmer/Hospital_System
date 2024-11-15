import React, { useState, useEffect } from "react";
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

// Mock data for demonstration
const appointments = [
  {
    id: 1,
    patientName: "John Doe",
    time: "09:00 AM",
    serviceType: "Check-up",
    medications: ["Aspirin", "Lisinopril"],
  },
  {
    id: 2,
    patientName: "Jane Smith",
    time: "10:30 AM",
    serviceType: "Follow-up",
    medications: ["Metformin"],
  },
  {
    id: 3,
    patientName: "Bob Johnson",
    time: "02:00 PM",
    serviceType: "Consultation",
    medications: [],
  },
];

export default function DoctorSchedulePage() {
  const [todaysSchedule, setTodaysSchedule] = useState([]);

  //-----------Fetch Todays Doctor Schedule-----------------\\
  const fetchTodaysSchedule = async () => {
    try {
      //Get the doctors token
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

  return (
    <div className="container mx-auto p-4">
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
              const date = new Date(appointment.appointmentDateTime);
              const timeOfAppointment = date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });
              const currentTime12Hour = new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              });
              return (
                <React.Fragment key={appointment.appointmentID}>
                  <TableRow>
                    <TableCell>{appointment.fullName}</TableCell>
                    <TableCell>{timeOfAppointment}</TableCell>
                    <TableCell>{appointment.serviceName}</TableCell>
                    <TableCell>
                      {timeOfAppointment < currentTime12Hour ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => proceedToAppointment(appointment.id)}
                            disabled={true}
                          >
                            Proceed with Appointment
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button variant="primary" size="sm" disabled={true}>
                            Upcoming Appointment
                          </Button>
                        </div>
                      )}
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
