import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localization setup
const locales = {
  "en-US": import("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Week starts on Monday
  getDay,
  locales,
});

// Utility function to format phone numbers
const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumberString; // Return the original string if it doesn't match
};

function DocAppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Filter States
  const [patientFilter, setPatientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Unique Patients and Statuses for Filters
  const [uniquePatients, setUniquePatients] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentModal, setSelectedAppointmentModal] = useState(null);

  // Define the status-to-color mapping
  const statusColors = {
    Scheduled: "#28a745", // Green
    Requested: "#ffc107", // Yellow
    Completed: "#17a2b8", // Teal
    Cancelled: "#dc3545", // Red
    Missed: "#fd7e14", // Orange
    "Request Denied": "#6f42c1", // Purple
    Other: "#6c757d", // Gray
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/appointment/doctorAppointments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const appointmentsData = response.data;

        // Extract unique patients and statuses
        const patients = new Set();
        const statuses = new Set();

        appointmentsData.forEach((app) => {
          const patientName = `${app.patientFirstName} ${app.patientLastName}`;
          patients.add(patientName);
          statuses.add(app.status);
        });

        setUniquePatients(Array.from(patients));
        setUniqueStatuses(Array.from(statuses));

        // Map appointments to calendar events
        const events = appointmentsData.map((app) => ({
          title: `${app.patientFirstName} ${app.patientLastName} - ${
            app.reason || "No Reason"
          }`,
          start: new Date(app.appointmentDateTime),
          end: new Date(
            new Date(app.appointmentDateTime).getTime() + 30 * 60000
          ), // Assuming 30 mins duration
          allDay: false,
          resource: app, // Attach the entire appointment object
        }));

        setAppointments(events);
        setFilteredAppointments(events);
        setLoading(false);
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
  }, [patientFilter, statusFilter, dateFilter, appointments]);

  const applyFilters = () => {
    let filtered = appointments;

    // Patient Filter
    if (patientFilter) {
      filtered = filtered.filter((app) => {
        const patientName = `${app.resource.patientFirstName} ${app.resource.patientLastName}`;
        return patientName === patientFilter;
      });
    }

    // Status Filter
    if (statusFilter) {
      filtered = filtered.filter((app) => app.resource.status === statusFilter);
    }

    // Date Filter
    if (dateFilter.start) {
      const startDate = new Date(dateFilter.start);
      filtered = filtered.filter((app) => new Date(app.start) >= startDate);
    }

    if (dateFilter.end) {
      const endDate = new Date(dateFilter.end);
      filtered = filtered.filter((app) => new Date(app.start) <= endDate);
    }

    setFilteredAppointments(filtered);
  };

  // Handle event selection to show details in a modal
  const handleSelectEvent = (event) => {
    setSelectedAppointmentModal(event.resource);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentModal(null);
  };

  // Handle accept/reject appointment
  const handleUpdateAppointment = async (appointmentID, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/appointment/updateAppointment",
        { appointmentID, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh appointments
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/appointment/doctorAppointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const appointmentsData = response.data;

      // Extract unique patients and statuses
      const patients = new Set();
      const statuses = new Set();

      appointmentsData.forEach((app) => {
        const patientName = `${app.patientFirstName} ${app.patientLastName}`;
        patients.add(patientName);
        statuses.add(app.status);
      });

      setUniquePatients(Array.from(patients));
      setUniqueStatuses(Array.from(statuses));

      // Map appointments to calendar events
      const events = appointmentsData.map((app) => ({
        title: `${app.patientFirstName} ${app.patientLastName} - ${
          app.reason || "No Reason"
        }`,
        start: new Date(app.appointmentDateTime),
        end: new Date(
          new Date(app.appointmentDateTime).getTime() + 30 * 60000
        ), // Assuming 30 mins duration
        allDay: false,
        resource: app, // Attach the entire appointment object
      }));

      setAppointments(events);
      setFilteredAppointments(events);
      setLoading(false);
      closeModal();
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment status.");
    }
  };

  // Custom styles for events based on status
  const eventStyleGetter = (event, start, end, isSelected) => {
    // Correctly access the status from event.resource
    const backgroundColor =
      statusColors[event.resource.status] || statusColors.Other;

    const style = {
      backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  if (loading) {
    return <p className="text-center">Loading calendar...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Appointments Calendar
      </h1>

      {/* Filters Section */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Filter Appointments</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Patient Filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="patient" className="block text-gray-700 mb-2">
              Patient:
            </label>
            <select
              id="patient"
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All Patients</option>
              {uniquePatients.map((patient, index) => (
                <option key={index} value={patient}>
                  {patient}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="status" className="block text-gray-700 mb-2">
              Status:
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
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
                onChange={(e) =>
                  setDateFilter((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-1/2 border border-gray-300 rounded-md p-2"
              />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) =>
                  setDateFilter((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-1/2 border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              setPatientFilter("");
              setStatusFilter("");
              setDateFilter({ start: "", end: "" });
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Render Calendar */}
      <Calendar
        localizer={localizer}
        events={filteredAppointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={["month", "week", "day"]}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        resizable
        popup
      />

      {/* Custom Modal for Appointment Details */}
      {isModalOpen && selectedAppointmentModal && (
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
              {new Date(
                selectedAppointmentModal.appointmentDateTime
              ).toLocaleString()}
            </p>
            <p>
              <strong>Reason:</strong> {selectedAppointmentModal.reason || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointmentModal.status}
            </p>
            <p>
              <strong>Visit Type:</strong>{" "}
              {selectedAppointmentModal.visitType || "N/A"}
            </p>
            <p>
              <strong>Patient:</strong>{" "}
              {selectedAppointmentModal.patientFirstName}{" "}
              {selectedAppointmentModal.patientLastName}
            </p>
            <p>
              <strong>Patient's Email:</strong>{" "}
              {selectedAppointmentModal.patientEmail || "N/A"}
            </p>
            <p>
              <strong>Patient's Phone:</strong>{" "}
              {selectedAppointmentModal.patientPhoneNumber
                ? formatPhoneNumber(
                    selectedAppointmentModal.patientPhoneNumber
                  )
                : "N/A"}
            </p>
            <p>
              <strong>Patient's DOB:</strong>{" "}
              {selectedAppointmentModal.patientDOB
                ? new Date(
                    selectedAppointmentModal.patientDOB
                  ).toLocaleDateString()
                : "N/A"}
            </p>
            {/* Add more details as needed */}
            <div className="flex justify-end mt-6 space-x-2">
              {selectedAppointmentModal.status === "Requested" && (
                <>
                  <button
                    onClick={() =>
                      handleUpdateAppointment(
                        selectedAppointmentModal.appointmentID,
                        "Scheduled"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateAppointment(
                        selectedAppointmentModal.appointmentID,
                        "Request Denied"
                      )
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Reject
                  </button>
                </>
              )}
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

export default DocAppointmentCalendar;
