// client/src/components/users/patient/AppointmentOverview.jsx

import { useState, useEffect } from "react";
import axios from "axios";

// Utility function to format phone numbers
const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumberString; // Return the original string if it doesn't match
};

// Utility function to sort appointments in descending order
const sortAppointmentsDescending = (appointmentsList) => {
  return [...appointmentsList].sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime));
};

function AppointmentOverview() {
  const [appointments, setAppointments] = useState({
    upcoming: [],
    requested: [],
    past: [],
    other: []
  });
  const [filteredAppointments, setFilteredAppointments] = useState({
    upcoming: [],
    requested: [],
    past: [],
    other: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [doctorFilter, setDoctorFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Unique Doctors and Locations for Filters
  const [uniqueDoctors, setUniqueDoctors] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/appointment/my-appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
        setFilteredAppointments(response.data);
        setLoading(false);

        // Extract unique doctors and locations using Set for uniqueness
        const doctors = new Set();
        const locations = new Set();

        Object.values(response.data).forEach(category => {
          category.forEach(app => {
            const doctorName = `Dr. ${app.doctorFirstName} ${app.doctorLastName}`;
            doctors.add(doctorName);
            locations.add(app.officeName);
          });
        });

        setUniqueDoctors(Array.from(doctors));
        setUniqueLocations(Array.from(locations));
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    // Apply Filters whenever filter states change
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorFilter, locationFilter, dateFilter, appointments]);

  const applyFilters = () => {
    const { upcoming, requested, past, other } = appointments;

    const filterList = (list) => {
      return list.filter(app => {
        // Doctor Filter
        if (doctorFilter) {
          const doctorName = `Dr. ${app.doctorFirstName} ${app.doctorLastName}`;
          if (doctorName !== doctorFilter) return false;
        }

        // Location Filter
        if (locationFilter) {
          if (app.officeName !== locationFilter) return false;
        }

        // Date Filter
        if (dateFilter.start) {
          const appDate = new Date(app.appointmentDateTime);
          const startDate = new Date(dateFilter.start);
          if (appDate < startDate) return false;
        }

        if (dateFilter.end) {
          const appDate = new Date(app.appointmentDateTime);
          const endDate = new Date(dateFilter.end);
          if (appDate > endDate) return false;
        }

        return true;
      });
    };

    setFilteredAppointments({
      upcoming: filterList(upcoming),
      requested: filterList(requested),
      past: filterList(past),
      other: filterList(other)
    });
  };

  // Handle event selection to show details in a modal
  const handleSelectEvent = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return <p className="text-center">Loading appointments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const renderAppointmentList = (title, list) => {
    // Determine if the current list should be sorted in descending order
    const shouldSortDescending = title === "Upcoming Appointments" || title === "Requested Appointments";
    
    // Sort the list if necessary
    const sortedList = shouldSortDescending ? sortAppointmentsDescending(list) : list;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {sortedList.length === 0 ? (
          <p className="text-gray-500">No appointments in this category.</p>
        ) : (
          <ul className="space-y-4">
            {sortedList.map((appointment) => (
              <li
                key={appointment.appointmentID}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectEvent(appointment)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold">
                      {new Date(appointment.appointmentDateTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">Reason: {appointment.reason || "N/A"}</p>
                    <p className="text-gray-600">Status: {appointment.status}</p>
                    <p className="text-gray-600">
                    <p className="text-gray-600">
                      Service: {appointment.service || "N/A"}
                    </p>
                    <p>
                      Visit Type: {appointment.visitType || "N/A"}
                    </p>
                      Doctor: Dr. {appointment.doctorFirstName} {appointment.doctorLastName}
                    </p>
                    <p className="text-gray-600">
                      Doctor's Email: {appointment.doctorEmail || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Doctor's Phone: {appointment.doctorPhone ? formatPhoneNumber(appointment.doctorPhone) : "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Location: {appointment.officeName}, {appointment.officeAddress}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Appointments</h1>

      {/* Filters Section */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Filter Appointments</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Doctor Filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="doctor" className="block text-gray-700 mb-2">Doctor:</label>
            <select
              id="doctor"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All Doctors</option>
              {uniqueDoctors.map((doctor, index) => (
                <option key={index} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="location" className="block text-gray-700 mb-2">Location:</label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Date Range:</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                className="w-1/2 border border-gray-300 rounded-md p-2"
              />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                className="w-1/2 border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              setDoctorFilter("");
              setLocationFilter("");
              setDateFilter({ start: "", end: "" });
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Render Categorized Appointments */}
      {renderAppointmentList("Upcoming Appointments", filteredAppointments.upcoming)}
      {renderAppointmentList("Requested Appointments", filteredAppointments.requested)}
      {renderAppointmentList("Past Appointments", filteredAppointments.past)}
      {renderAppointmentList("Other Appointments", filteredAppointments.other)}

      {/* Custom Modal for Appointment Details */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(selectedAppointment.appointmentDateTime).toLocaleString()}
            </p>
            <p>
              <strong>Reason:</strong> {selectedAppointment.reason || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Service:</strong> {selectedAppointment.service || "N/A"}
            </p>
            <p>
              <strong>Visit Type:</strong> {selectedAppointment.visitType || "N/A"}
            </p>
            <p>
              <strong>Doctor:</strong> Dr. {selectedAppointment.doctorFirstName} {selectedAppointment.doctorLastName}
            </p>
            <p>
              <strong>Doctor's Email:</strong> {selectedAppointment.doctorEmail || "N/A"}
            </p>
            <p>
              <strong>Doctor's Phone:</strong>{" "}
              {selectedAppointment.doctorPhone ? formatPhoneNumber(selectedAppointment.doctorPhone) : "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {selectedAppointment.officeName}, {selectedAppointment.officeAddress}
            </p>
            {/* Add more details as needed */}
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentOverview;
