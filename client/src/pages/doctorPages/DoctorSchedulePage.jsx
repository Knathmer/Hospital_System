import React, { useState } from "react";
import Button from "../../components/ui/Button";

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
          {appointments.map((appointment) => (
            <React.Fragment key={appointment.id}>
              <TableRow>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.serviceType}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => proceedToAppointment(appointment.id)}
                    >
                      Proceed with Appointment
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
