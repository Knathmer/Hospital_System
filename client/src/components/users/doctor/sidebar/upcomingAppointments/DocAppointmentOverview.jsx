import { useState, useEffect } from "react";
import axios from "axios";
import AppointmentModal from "./AppointmentModal";
import MultiSelectInput from "./MultiSelectInput"; // Adjust the import path accordingly

// Utility function to format phone numbers
const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumberString; // Return the original string if it doesn't match
};

// Utility function to sort appointments in descending order
const sortAppointmentsDescending = (appointmentsList) => {
  return [...appointmentsList].sort(
    (a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
  );
};

function DocAppointmentOverview() {
  const [appointments, setAppointments] = useState({
    upcoming: [],
    requested: [],
    past: [],
    other: [],
  });
  const [filteredAppointments, setFilteredAppointments] = useState({
    upcoming: [],
    requested: [],
    past: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Multi-select Filter States
  const [patientOptions, setPatientOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

        // Assume response.data is an array of appointments
        const appointmentsData = response.data;

        // Categorize appointments
        const categorizedAppointments = {
          upcoming: [],
          requested: [],
          past: [],
          other: [],
        };

        const now = new Date();

        appointmentsData.forEach((appointment) => {
          const appointmentDate = new Date(appointment.appointmentDateTime);
          switch (appointment.status) {
            case "Scheduled":
              if (appointmentDate >= now) {
                categorizedAppointments.upcoming.push(appointment);
              } else {
                categorizedAppointments.past.push(appointment);
              }
              break;
            case "Requested":
              categorizedAppointments.requested.push(appointment);
              break;
            case "Completed":
            case "Missed":
              categorizedAppointments.past.push(appointment);
              break;
            case "Cancelled":
            case "Request Denied":
              categorizedAppointments.other.push(appointment);
              break;
            default:
              categorizedAppointments.other.push(appointment);
          }
        });

        setAppointments(categorizedAppointments);
        setFilteredAppointments(categorizedAppointments);
        setLoading(false);

        // Extract unique patients and statuses
        const patients = new Set();
        const statuses = new Set();

        appointmentsData.forEach((appointment) => {
          const patientName = `${appointment.patientFirstName} ${appointment.patientLastName}`;
          patients.add(patientName);
          statuses.add(appointment.status);
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
    const { upcoming, requested, past, other } = appointments;

    const filterList = (list) => {
      return list.filter((app) => {
        // Patient Filter
        if (selectedPatients.length > 0) {
          const patientName = `${app.patientFirstName} ${app.patientLastName}`;
          const isSelected = selectedPatients.some(
            (selected) => selected.value === patientName
          );
          if (!isSelected) return false;
        }

        // Status Filter
        if (selectedStatuses.length > 0) {
          const isSelected = selectedStatuses.some(
            (selected) => selected.value === app.status
          );
          if (!isSelected) return false;
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
      upcoming: filterList(appointments.upcoming),
      requested: filterList(appointments.requested),
      past: filterList(appointments.past),
      other: filterList(appointments.other),
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

      // Process response and update state as before
      const appointmentsData = response.data;

      // Categorize appointments
      const categorizedAppointments = {
        upcoming: [],
        requested: [],
        past: [],
        other: [],
      };

      const now = new Date();

      appointmentsData.forEach((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDateTime);
        switch (appointment.status) {
          case "Scheduled":
            if (appointmentDate >= now) {
              categorizedAppointments.upcoming.push(appointment);
            } else {
              categorizedAppointments.past.push(appointment);
            }
            break;
          case "Requested":
            categorizedAppointments.requested.push(appointment);
            break;
          case "Completed":
          case "Missed":
            categorizedAppointments.past.push(appointment);
            break;
          case "Cancelled":
          case "Request Denied":
            categorizedAppointments.other.push(appointment);
            break;
          default:
            categorizedAppointments.other.push(appointment);
        }
      });

      setAppointments(categorizedAppointments);
      setFilteredAppointments(categorizedAppointments);
      setLoading(false);
      closeModal();
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment status.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading appointments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const renderAppointmentList = (title, list) => {
    // Determine if the current list should be sorted in descending order
    const shouldSortDescending =
      title === "Upcoming Appointments" || title === "Requested Appointments";

    // Sort the list if necessary
    const sortedList = shouldSortDescending
      ? sortAppointmentsDescending(list)
      : list;

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
                className="bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold">
                      {new Date(
                        appointment.appointmentDateTime
                      ).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Reason: {appointment.reason || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Status: {appointment.status}
                    </p>
                    <p className="text-gray-600">
                      Service: {appointment.serviceName || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Visit Type: {appointment.visitType || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Patient: {appointment.patientFirstName}{" "}
                      {appointment.patientLastName}
                    </p>
                    <p className="text-gray-600">
                      Patient's Email: {appointment.patientEmail || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Patient's Phone:{" "}
                      {appointment.patientPhoneNumber
                        ? formatPhoneNumber(appointment.patientPhoneNumber)
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  {appointment.status === "Requested" && (
                    <>
                      <button
                        onClick={() => handleSelectEvent(appointment, "Accept")}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleSelectEvent(appointment, "Reject")}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {appointment.status === "Scheduled" && (
                    <button
                      onClick={() => handleSelectEvent(appointment, "Cancel")}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                    >
                      Cancel Appointment
                    </button>
                  )}
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

      {/* Render Categorized Appointments */}
      {renderAppointmentList(
        "Requested Appointments",
        filteredAppointments.requested
      )}
      {renderAppointmentList(
        "Upcoming Appointments",
        filteredAppointments.upcoming
      )}
      {renderAppointmentList("Past Appointments", filteredAppointments.past)}
      {renderAppointmentList("Other Appointments", filteredAppointments.other)}

      {/* Appointment Modal */}
      {isModalOpen && selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={closeModal}
          onUpdateStatus={handleUpdateAppointment}
        />
      )}
    </div>
  );
}

export default DocAppointmentOverview;
