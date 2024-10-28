import React, { useState } from 'react';
import { format } from 'date-fns';
import Input from "../../ui/Input.jsx";
import Label from "../../ui/Label.jsx";
import Button from "../../ui/Button.jsx";
import Modal from "../../ui/Modal.jsx";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/Table.jsx";;

// Mock data for appointments and patients (unchanged)
const appointments = [
  { id: 1, date: new Date(2023, 5, 1, 10, 0), patientName: 'Alice Johnson', reason: 'Annual checkup' },
  { id: 2, date: new Date(2023, 5, 1, 11, 30), patientName: 'Bob Smith', reason: 'Follow-up appointment' },
  { id: 3, date: new Date(2023, 5, 1, 14, 0), patientName: 'Carol Williams', reason: 'Consultation' },
  { id: 4, date: new Date(2023, 5, 2, 9, 0), patientName: 'David Brown', reason: 'Routine examination' },
  { id: 5, date: new Date(2023, 5, 2, 10, 30), patientName: 'Emma Davis', reason: 'Prenatal checkup' },
];

const patients = {
  'Alice Johnson': { firstName: 'Alice', lastName: 'Johnson', dob: '1985-03-15', gender: 'Female', phone: '(555) 123-4567', email: 'alice@example.com' },
  'Bob Smith': { firstName: 'Bob', lastName: 'Smith', dob: '1978-07-22', gender: 'Male', phone: '(555) 234-5678', email: 'bob@example.com' },
  'Carol Williams': { firstName: 'Carol', lastName: 'Williams', dob: '1990-11-30', gender: 'Female', phone: '(555) 345-6789', email: 'carol@example.com' },
  'David Brown': { firstName: 'David', lastName: 'Brown', dob: '1982-09-05', gender: 'Male', phone: '(555) 456-7890', email: 'david@example.com' },
  'Emma Davis': { firstName: 'Emma', lastName: 'Davis', dob: '1995-01-18', gender: 'Female', phone: '(555) 567-8901', email: 'emma@example.com' },
};

const DoctorDashboard = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handlePatientClick = (patientName) => {
    setSelectedPatient(patients[patientName]);
    setIsPatientModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-pink-100">
        <div className="flex items-center space-x-4">
          <Button variant="ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold text-pink-600">Doctor Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Button>
          <Button variant="ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600 mb-4">
              Appointment Requests
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Manage your appointments and patient information efficiently.
            </p>
          </section>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-pink-100">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                  type="search"
                  placeholder="Search appointments..."
                  className="w-full sm:w-64"
                />
                <Button className="w-full sm:w-auto bg-pink-500 text-white hover:bg-pink-600">
                  Today
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-pink-50 text-pink-600">Date</TableHead>
                  <TableHead className="bg-pink-50 text-pink-600">Time</TableHead>
                  <TableHead className="bg-pink-50 text-pink-600">Patient Name</TableHead>
                  <TableHead className="bg-pink-50 text-pink-600">Reason</TableHead>
                  <TableHead className="bg-pink-50 text-pink-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-pink-50">
                    <TableCell>{format(appointment.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(appointment.date, 'HH:mm')}</TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleAppointmentClick(appointment)}
                        className="text-pink-500 hover:text-pink-600 hover:bg-pink-100"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Modal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Appointment Details</h2>
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="date" className="text-pink-600">Date</Label>
              <Input
                id="date"
                value={format(selectedAppointment.date, 'yyyy-MM-dd')}
                readOnly
                className="bg-pink-50"
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-pink-600">Time</Label>
              <Input
                id="time"
                value={format(selectedAppointment.date, 'HH:mm')}
                readOnly
                className="bg-pink-50"
              />
            </div>
            <div>
              <Label htmlFor="patient" className="text-pink-600">Patient</Label>
              <Button 
                variant="secondary" 
                onClick={() => handlePatientClick(selectedAppointment.patientName)}
                className="w-full justify-start bg-pink-50 text-pink-600 hover:bg-pink-100"
              >
                {selectedAppointment.patientName}
              </Button>
            </div>
            <div>
              <Label htmlFor="reason" className="text-pink-600">Reason</Label>
              <Input
                id="reason"
                defaultValue={selectedAppointment.reason}
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-pink-600">Status</Label>
              <select
                id="status"
                className="w-full border-2 border-pink-200 rounded-md px-2 h-10 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                defaultValue="pending"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsAppointmentModalOpen(false)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
              <Button className="bg-pink-500 text-white hover:bg-pink-600">Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Patient Information</h2>
        {selectedPatient && (
          <div className="space-y-4">
            <div>
              <Label className="text-pink-600">Name</Label>
              <div className="bg-pink-50 p-2 rounded">{selectedPatient.firstName} {selectedPatient.lastName}</div>
            </div>
            <div>
              <Label className="text-pink-600">Date of Birth</Label>
              <div className="bg-pink-50 p-2 rounded">{selectedPatient.dob}</div>
            </div>
            <div>
              <Label className="text-pink-600">Gender</Label>
              <div className="bg-pink-50 p-2 rounded">{selectedPatient.gender}</div>
            </div>
            <div>
              <Label className="text-pink-600">Phone</Label>
              <div className="bg-pink-50 p-2 rounded">{selectedPatient.phone}</div>
            </div>
            <div>
              <Label className="text-pink-600">Email</Label>
              <div className="bg-pink-50 p-2 rounded">{selectedPatient.email}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorDashboard;