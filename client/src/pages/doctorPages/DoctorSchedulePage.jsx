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
  //Fetch the doctors schedule on refresh or when the open the site.
  useEffect(() => {
    fetchTodaysSchedule();
  }, []);

  //-------End of Fetching Todays Schedule-------------------\\

  //-------If the appointment is after the appointment window, set appt status to missed\\

  const updateAppointmentToMissed = async (appointmentID) => {
    //If the appointment has already been updated simply skip the function call.
    if (updatedAppointments.has(appointmentID)) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/auth/doctor/missed-schedule",
        { appointmentID, status: "Missed Appointment" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUpdatedAppointments((prev) => new Set(prev).add(appointmentID));
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };
  useEffect(() => {
    const checkAndUpdateMissedAppointments = async () => {
      const now = new Date();

      for (const appointment of todaysSchedule) {
        const appointmentDate = new Date(appointment.appointmentDateTime);
        const appointmentEndTime = new Date(
          appointmentDate.getTime() + 30 * 60 * 1000
        );

        if (
          now > appointmentEndTime &&
          !updatedAppointments.has(appointment.appointmentID)
        ) {
          await updateAppointmentToMissed(appointment.appointmentID);
        }
      }
    };

    checkAndUpdateMissedAppointments();
  }, [todaysSchedule]);
  //---------------------------------------------------------
  const proceedToAppointment = (appointmentID) => {
    navigate(`/doctor/schedule/appointments/${appointmentID}`);
  };

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
              const appointmentDate = new Date(appointment.appointmentDateTime);
              const currentTime = new Date();
              const timeOfAppointment = appointmentDate.toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              );

              const appointmentEndTime = new Date(
                appointmentDate.getTime() + 30 * 60 * 1000
              );
              const isBeforeAppointment = currentTime < appointmentDate;
              const isDuringAppointment =
                currentTime >= appointmentDate &&
                currentTime <= appointmentEndTime;
              const isAfterAppointment = currentTime > appointmentEndTime;
              return (
                <React.Fragment key={appointment.appointmentID}>
                  <TableRow>
                    <TableCell>{appointment.fullName}</TableCell>
                    <TableCell>{timeOfAppointment}</TableCell>
                    <TableCell>{appointment.serviceName}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {isDuringAppointment ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              proceedToAppointment(appointment.appointmentID)
                            }
                          >
                            Proceed with Appointment
                          </Button>
                        ) : isBeforeAppointment ? (
                          <Button variant="primary" size="sm" disabled>
                            Upcoming Appointment
                          </Button>
                        ) : (
                          <Button variant="secondary" size="sm" disabled>
                            Missed Appointment
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
