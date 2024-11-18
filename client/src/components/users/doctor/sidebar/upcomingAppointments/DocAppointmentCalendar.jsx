import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppointmentModal from "./AppointmentModal";
import MultiSelectInput from "./MultiSelectInput";

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

  // Multi-select Filter States
  const [patientOptions, setPatientOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

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

        // Prepare options for MultiSelectInput
        const patientOptionsArray = Array.from(patients).map((patient) => ({
          value: patient,
          label: patient,
        }));
        const statusOptionsArray = Array.from(statuses).map((status) => ({
          value: status,
          label: status,
        }));

        setPatientOptions(patientOptionsArray);
        setStatusOptions(statusOptionsArray);

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
  }, [selectedPatients, selectedStatuses, dateFilter, appointments]);

  const applyFilters = () => {
    let filtered = appointments;

    // Patient Filter
    if (selectedPatients.length > 0) {
      filtered = filtered.filter((app) => {
        const patientName = `${app.resource.patientFirstName} ${app.resource.patientLastName}`;
        const isSelected = selectedPatients.some(
          (selected) => selected.value === patientName
        );
        return isSelected;
      });
    }

    // Status Filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((app) => {
        const isSelected = selectedStatuses.some(
          (selected) => selected.value === app.resource.status
        );
        return isSelected;
      });
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

  // Handle accept/reject/cancel appointment
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

      // Prepare options for MultiSelectInput
      const patientOptionsArray = Array.from(patients).map((patient) => ({
        value: patient,
        label: patient,
      }));
      const statusOptionsArray = Array.from(statuses).map((status) => ({
        value: status,
        label: status,
      }));

      setPatientOptions(patientOptionsArray);
      setStatusOptions(statusOptionsArray);

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
          <div className="flex-1">
            <MultiSelectInput
              label="Patient:"
              options={patientOptions}
              selectedValues={selectedPatients}
              setSelectedValues={setSelectedPatients}
              placeholder="Select Patients"
            />
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <MultiSelectInput
              label="Status:"
              options={statusOptions}
              selectedValues={selectedStatuses}
              setSelectedValues={setSelectedStatuses}
              placeholder="Select Statuses"
            />
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
              setSelectedPatients([]);
              setSelectedStatuses([]);
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
        <AppointmentModal
          appointment={selectedAppointmentModal}
          onClose={closeModal}
          onUpdateStatus={handleUpdateAppointment}
          showCancelOption={true}
        />
      )}
    </div>
  );
}

export default DocAppointmentCalendar;
