import { useState, useEffect } from "react";
import axios from "axios";

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

  // Filter States
  const [patientFilter, setPatientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Unique patients and statuses for Filters
  const [uniquePatients, setUniquePatients] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);

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

        setUniquePatients(Array.from(patients));
        setUniqueStatuses(Array.from(statuses));
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
    const { upcoming, requested, past, other } = appointments;

    const filterList = (list) => {
      return list.filter((app) => {
        // Patient Filter
        if (patientFilter) {
          const patientName = `${app.patientFirstName} ${app.patientLastName}`;
          if (patientName !== patientFilter) return false;
        }

        // Status Filter
        if (statusFilter) {
          if (app.status !== statusFilter) return false;
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
      other: filterList(other),
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
                    <p className="text-gray-600">
                      Reason: {appointment.reason || "N/A"}
                    </p>
                    <p className="text-gray-600">Status: {appointment.status}</p>
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
                    <p className="text-gray-600">
                      Patient's DOB:{" "}
                      {appointment.patientDOB
                        ? new Date(appointment.patientDOB).toLocaleDateString()
                        : "N/A"}
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

      {/* Render Categorized Appointments */}
      {renderAppointmentList(
        "Requested Appointments",
        filteredAppointments.requested
      )}
      {renderAppointmentList(
        "Upcoming Appointments",
        filteredAppointments.upcoming
      )}
      {renderAppointmentList(
        "Past Appointments",
        filteredAppointments.past
      )}
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
              {new Date(
                selectedAppointment.appointmentDateTime
              ).toLocaleString()}
            </p>
            <p>
              <strong>Reason:</strong> {selectedAppointment.reason || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Visit Type:</strong>{" "}
              {selectedAppointment.visitType || "N/A"}
            </p>
            <p>
              <strong>Patient:</strong> {selectedAppointment.patientFirstName}{" "}
              {selectedAppointment.patientLastName}
            </p>
            <p>
              <strong>Patient's Email:</strong>{" "}
              {selectedAppointment.patientEmail || "N/A"}
            </p>
            <p>
              <strong>Patient's Phone:</strong>{" "}
              {selectedAppointment.patientPhoneNumber
                ? formatPhoneNumber(selectedAppointment.patientPhoneNumber)
                : "N/A"}
            </p>
            <p>
              <strong>Patient's DOB:</strong>{" "}
              {selectedAppointment.patientDOB
                ? new Date(selectedAppointment.patientDOB).toLocaleDateString()
                : "N/A"}
            </p>
            {/* Add more details as needed */}
            <div className="flex justify-end mt-6 space-x-2">
              {selectedAppointment.status === "Requested" && (
                <>
                  <button
                    onClick={() =>
                      handleUpdateAppointment(
                        selectedAppointment.appointmentID,
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
                        selectedAppointment.appointmentID,
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

export default DocAppointmentOverview;
