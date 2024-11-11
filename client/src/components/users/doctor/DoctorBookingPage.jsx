import React, { useState, useEffect } from 'react'; // Updated import

import { format } from 'date-fns';

// TEMPORARY, moved needed components so my small brain understands everything

// Input Component
const Input = ({ className = "", placeholder = "", type = "", ...props }) => {
  return (
    <input
      className={`border-2 border-pink-200 rounded-md px-2 h-10 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50 ${className}`}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
};

// Label Component
const Label = ({ className = "", children, ...props }) => {
  return (
    <label
      className={`text-sm font-medium leading-none text-pink-600 py-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

// Button Component
const Button = ({ className = "", children, variant = "primary", ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantStyles = {
    primary: "bg-pink-500 text-white hover:bg-pink-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "text-pink-500 hover:bg-pink-100",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Table Components
const Table = ({ children, className = "", ...props }) => (
  <table className={`w-full border-collapse ${className}`} {...props}>
    {children}
  </table>
);

const TableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
);

const TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);

const TableRow = ({ children, className = "", ...props }) => (
  <tr className={`border-b border-pink-100 ${className}`} {...props}>
    {children}
  </tr>
);

const TableHead = ({ children, className = "", ...props }) => (
  <th
    className={`text-left p-2 bg-pink-50 text-pink-600 font-semibold ${className}`}
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "", ...props }) => (
  <td className={`p-2 ${className}`} {...props}>
    {children}
  </td>
);


const DoctorBookingPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);


  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };
  

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const updatedAppointment = {
        appointmentID: selectedAppointment.appointmentID,
        reason: selectedAppointment.reason,
        status: selectedAppointment.status,
      };
  
      const response = await fetch('http://localhost:3000/appointment/updateAppointment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedAppointment)
      });
  
      if (response.ok) {
        // Update appointments state
        const updatedAppointments = appointments.map(app => {
          if (app.appointmentID === updatedAppointment.appointmentID) {
            return { ...app, ...updatedAppointment };
          } else {
            return app;
          }
        });
        setAppointments(updatedAppointments);
        setIsAppointmentModalOpen(false);
      } else {
        console.error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };
  
  const handlePatientClick = (appointment) => {
  setSelectedPatient({
    firstName: appointment.patientFirstName,
    lastName: appointment.patientLastName,
    dob: appointment.patientDOB,
    gender: appointment.patientGender,
    phone: appointment.patientPhoneNumber,
    email: appointment.patientEmail
  });
  setIsPatientModalOpen(true);
  };


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/appointment/doctorAppointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
  
    fetchAppointments();
  }, []);
  

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
                <Button className="w-full sm:w-auto">
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
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentID} className="hover:bg-pink-50">
                  <TableCell>{format(new Date(appointment.appointmentDateTime), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(appointment.appointmentDateTime), 'HH:mm')}</TableCell>
                  <TableCell>{appointment.patientFirstName} {appointment.patientLastName}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                  <Button 
                  variant="ghost" 
                  onClick={() => handleAppointmentClick(appointment)}
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
      <Label htmlFor="date">Date</Label>
      <Input
        id="date"
        value={format(new Date(selectedAppointment.appointmentDateTime), 'yyyy-MM-dd')}
        readOnly
        className="bg-pink-50"
      />
    </div>
    <div>
      <Label htmlFor="time">Time</Label>
      <Input
        id="time"
        value={format(new Date(selectedAppointment.appointmentDateTime), 'HH:mm')}
        readOnly
        className="bg-pink-50"
      />
    </div>
    <div>
      <Label htmlFor="patient">Patient</Label>
      <Button 
        variant="secondary" 
        onClick={() => handlePatientClick(selectedAppointment)}
        className="w-full justify-start bg-pink-50 text-pink-600 hover:bg-pink-100"
      >
        {selectedAppointment.patientFirstName} {selectedAppointment.patientLastName}
      </Button>
    </div>
    <div>
      <Label htmlFor="reason">Reason</Label>
      <Input
        id="reason"
        value={selectedAppointment.reason}
        onChange={(e) => setSelectedAppointment({ ...selectedAppointment, reason: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="status">Status</Label>
      <select
        id="status"
        className="w-full border-2 border-pink-200 rounded-md px-2 h-10 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
        value={selectedAppointment.status}
        onChange={(e) => setSelectedAppointment({ ...selectedAppointment, status: e.target.value })}
      >
        <option value="Requested">Requested</option>
        <option value="Scheduled">Scheduled</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
    <div className="flex justify-end space-x-2">
      <Button variant="secondary" onClick={() => setIsAppointmentModalOpen(false)}>Cancel</Button>
      <Button onClick={handleSaveChanges}>Save Changes</Button>
    </div>
  </div>
)}

      </Modal>

      <Modal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Patient Information</h2>
        {selectedPatient && (
  <div className="space-y-4">
    <div>
      <Label>Name</Label>
      <div className="bg-pink-50 p-2 rounded">{selectedPatient.firstName} {selectedPatient.lastName}</div>
    </div>
    <div>
      <Label>Date of Birth</Label>
      <div className="bg-pink-50 p-2 rounded">{selectedPatient.dob}</div>
    </div>
    <div>
      <Label>Gender</Label>
      <div className="bg-pink-50 p-2 rounded">{selectedPatient.gender}</div>
    </div>
    <div>
      <Label>Phone</Label>
      <div className="bg-pink-50 p-2 rounded">{selectedPatient.phone}</div>
    </div>
    <div>
      <Label>Email</Label>
      <div className="bg-pink-50 p-2 rounded">{selectedPatient.email}</div>
    </div>
  </div>
)}

      </Modal>
    </div>
  );
};

export default DoctorBookingPage;