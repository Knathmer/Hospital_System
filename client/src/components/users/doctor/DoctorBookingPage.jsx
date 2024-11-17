import React, { useState, useEffect } from "react"; // Updated import
import { format } from "date-fns";
import { Link } from "react-router-dom";

import envConfig from "../../../envConfig";

const DoctorBookingPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [sortStatus, setSortStatus] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [sortField, setSortField] = useState("appointmentDateTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingStatus, setEditingStatus] = useState(null);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${envConfig.apiUrl}/appointment/doctorAppointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleStatusChange = async (appointmentID, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${envConfig.apiUrl}/appointment/updateAppointment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ appointmentID, status: newStatus }),
        }
      );

      if (response.ok) {
        // Update the status locally after successful backend update
        setAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app.appointmentID === appointmentID
              ? { ...app, status: newStatus }
              : app
          )
        );
        setEditingStatus(null); // Exit editing mode
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to update status:",
          errorData.error || "Unknown error"
        );
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the status. Please try again.");
    }
  };

  const filteredAndSortedAppointments = appointments
    .filter((app) => {
      const matchesStatus = sortStatus === "All" || app.status === sortStatus;
      const matchesName =
        searchName === "" ||
        `${app.patientFirstName} ${app.patientLastName}`
          .toLowerCase()
          .includes(searchName.toLowerCase());
      return matchesStatus && matchesName;
    })
    .sort((a, b) => {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      if (sortOrder === "asc") return dateA - dateB;
      return dateB - dateA;
    });

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
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
                <select
                  className="border-2 border-pink-200 rounded-md px-2 h-10"
                  value={sortStatus}
                  onChange={(e) => setSortStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Requested">Requested</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <input
                  type="text"
                  placeholder="Search by patient name..."
                  className="border-2 border-pink-200 rounded-md px-2 h-10"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <select
                  className="border-2 border-pink-200 rounded-md px-2 h-10"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="appointmentDateTime">Requested Date</option>
                  <option value="createdAt">Created Date</option>
                </select>
                <select
                  className="border-2 border-pink-200 rounded-md px-2 h-10"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-pink-100">
                  <th className="text-left p-2 bg-pink-50 text-pink-600 font-semibold">
                    Requested Date
                  </th>
                  <th className="text-left p-2 bg-pink-50 text-pink-600 font-semibold">
                    Time
                  </th>
                  <th className="text-left p-2 bg-pink-50 text-pink-600 font-semibold">
                    Patient Name
                  </th>
                  <th className="text-left p-2 bg-pink-50 text-pink-600 font-semibold">
                    Reason
                  </th>
                  <th className="text-left p-2 bg-pink-50 text-pink-600 font-semibold">
                    Status
                  </th>
                  <th className="text-left p-2 bg-pink-50 text-pink-600 font-semibold">
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedAppointments.map((appointment) => (
                  <tr
                    key={appointment.appointmentID}
                    className="hover:bg-pink-50"
                  >
                    <td className="p-2">
                      {format(
                        new Date(appointment.appointmentDateTime),
                        "MMM dd, yyyy"
                      )}
                    </td>
                    <td className="p-2">
                      {format(
                        new Date(appointment.appointmentDateTime),
                        "HH:mm"
                      )}
                    </td>
                    <td className="p-2">
                      <Link
                        to={`/doctor/patient/${appointment.patientID}`}
                        className="text-pink-500 hover:underline"
                      >
                        {`${appointment.patientFirstName} ${appointment.patientLastName}`}
                      </Link>
                    </td>
                    <td className="p-2">{appointment.reason}</td>
                    <td className="p-2">
                      {editingStatus === appointment.appointmentID ? (
                        <select
                          className="border-2 border-pink-200 rounded-md px-2 h-10"
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusChange(
                              appointment.appointmentID,
                              e.target.value
                            )
                          }
                        >
                          <option value="Requested">Requested</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className="cursor-pointer text-pink-500 hover:underline"
                          onClick={() =>
                            setEditingStatus(appointment.appointmentID)
                          }
                        >
                          {appointment.status}
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {format(new Date(appointment.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorBookingPage;
