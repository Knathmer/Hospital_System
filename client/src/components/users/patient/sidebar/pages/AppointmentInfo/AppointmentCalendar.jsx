import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

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

// Enable drag-and-drop if needed
const DnDCalendar = withDragAndDrop(Calendar);

// Utility function to format phone numbers
const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumberString; // Return the original string if it doesn't match
};

function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // For modal

  // Filter States
  const [doctorFilter, setDoctorFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Unique Doctors and Locations for Filters
  const [uniqueDoctors, setUniqueDoctors] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentModal, setSelectedAppointmentModal] = useState(null);

  // Define the status-to-color mapping
  const statusColors = {
    Scheduled: "#28a745",        // Green
    Requested: "#ffc107",        // Yellow
    Completed: "#17a2b8",        // Teal
    Cancelled: "#dc3545",        // Red
    Missed: "#fd7e14",            // Orange
    "Request Denied": "#6f42c1", // Dark Red
    Other: "#6c757d",             // Gray
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/appointment/my-appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { upcoming, requested, past, other } = response.data;

        // Combine desired categories
        const combinedAppointments = [
          ...upcoming,
          ...requested,
          ...past,
          ...other,
        ];

        // Extract unique doctors and locations using Set for uniqueness
        const doctors = new Set();
        const locations = new Set();

        combinedAppointments.forEach((app) => {
          const doctorName = `Dr. ${app.doctorFirstName} ${app.doctorLastName}`;
          doctors.add(doctorName);
          locations.add(app.officeName);
        });

        setUniqueDoctors(Array.from(doctors));
        setUniqueLocations(Array.from(locations));

        // Map combined appointments to calendar events
        const events = combinedAppointments.map((app) => ({
          title: `Dr. ${app.doctorFirstName} ${app.doctorLastName} - ${app.reason || "No Reason"}`,
          start: new Date(app.appointmentDateTime),
          end: new Date(new Date(app.appointmentDateTime).getTime() + 30 * 60000), // Assuming 30 mins duration
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
  }, [doctorFilter, locationFilter, dateFilter, appointments]);

  const applyFilters = () => {
    let filtered = appointments;

    // Doctor Filter
    if (doctorFilter) {
      filtered = filtered.filter((app) => {
        const doctorName = `Dr. ${app.resource.doctorFirstName} ${app.resource.doctorLastName}`;
        return doctorName === doctorFilter;
      });
    }

    // Location Filter
    if (locationFilter) {
      filtered = filtered.filter((app) => app.resource.officeName === locationFilter);
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

  // Re-map filtered appointments for the calendar
  const calendarEvents = filteredAppointments.map((app) => ({
    title: app.title,
    start: app.start,
    end: app.end,
    allDay: app.allDay,
    resource: app.resource,
  }));

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

  // Custom styles for events based on status
  const eventStyleGetter = (event, start, end, isSelected) => {
    // Correctly access the status from event.resource
    const backgroundColor = statusColors[event.resource.status] || statusColors.Other;

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
      <h1 className="text-3xl font-bold mb-6 text-center">Appointments Calendar</h1>

      {/* Filters Section */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Filter Appointments</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Doctor Filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="doctor" className="block text-gray-700 mb-2">
              Doctor:
            </label>
            <select
              id="doctor"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All Doctors</option>
              {uniqueDoctors.map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="location" className="block text-gray-700 mb-2">
              Location:
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
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

      {/* Render Calendar */}
      <DnDCalendar
        localizer={localizer}
        events={calendarEvents}
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
              {new Date(selectedAppointmentModal.appointmentDateTime).toLocaleString()}
            </p>
            <p>
              <strong>Reason:</strong> {selectedAppointmentModal.reason || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointmentModal.status}
            </p>
            <p>
              <strong>Service:</strong> {selectedAppointmentModal.service || "N/A"}
            </p>
            <p>
              <strong>Visit Type:</strong> {selectedAppointmentModal.visitType || "N/A"}
            </p>
            <p>
              <strong>Doctor:</strong> Dr. {selectedAppointmentModal.doctorFirstName} {selectedAppointmentModal.doctorLastName}
            </p>
            <p>
              <strong>Doctor's Email:</strong> {selectedAppointmentModal.doctorEmail || "N/A"}
            </p>
            <p>
              <strong>Doctor's Phone:</strong>{" "}
              {selectedAppointmentModal.doctorPhone ? formatPhoneNumber(selectedAppointmentModal.doctorPhone) : "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {selectedAppointmentModal.officeName}, {selectedAppointmentModal.officeAddress}
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

export default AppointmentCalendar;
