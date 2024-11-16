import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Clipboard, UserCheck, Clock } from "lucide-react";

const AppointmentAnalytics = () => {
  const [filters, setFilters] = useState({
    department: "",
    doctor: "",
    dateFrom: "",
    dateTo: "",
    year: "",
    month: "",
  });

  const [appointmentStats, setAppointmentStats] = useState([]);
  const [doctorWorkload, setDoctorWorkload] = useState({ workload: [], hoursWorked: [] });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const fetchAnalytics = () => {
    // Fetch Appointment Statistics
    axios.get("http://localhost:3000/admin/appointmentAnalytics/appointmentStatistics")
      .then((response) => setAppointmentStats(response.data))
      .catch((error) => console.error("Error fetching appointment statistics:", error));

    // Fetch Doctor Workload
    axios.get("http://localhost:3000/admin/appointmentAnalytics/doctorWorkload")
      .then((response) => setDoctorWorkload(response.data))
      .catch((error) => console.error("Error fetching doctor workload:", error));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
        <h1 className="ml-2 text-2xl font-bold text-gray-900">Appointment Analytics</h1>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All</option>
                <option value="Surgery">Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Cardiology">Cardiology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor</label>
              <input
                type="text"
                name="doctor"
                value={filters.doctor}
                onChange={handleFilterChange}
                placeholder="Type doctor name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date From</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date To</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All</option>
                {[...Array(10).keys()].map((i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={fetchAnalytics}
            className="mt-4 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
          >
            Apply Filters
          </button>
        </div>

        {/* Analytics Sections */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Appointment Statistics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clipboard className="h-5 w-5 text-pink-500 mr-2" />
              Appointment Statistics
            </h2>
            <ul className="space-y-2">
              {appointmentStats.map((stat, index) => (
                <li key={index}>
                  <span className="font-medium">{stat.AppointmentStatus} ({stat.VisitType}):</span> {stat.TotalAppointments}
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Workload: Total Appointments */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UserCheck className="h-5 w-5 text-pink-500 mr-2" />
              Doctor Workload: Appointments
            </h2>
            <ul className="space-y-2">
              {doctorWorkload.workload.map((workload, index) => (
                <li key={index}>
                  <span className="font-medium">{workload.DoctorName}:</span> {workload.TotalAppointments} appointments
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Workload: Hours Worked */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 text-pink-500 mr-2" />
              Doctor Workload: Hours Worked
            </h2>
            <ul className="space-y-2">
              {doctorWorkload.hoursWorked.map((hours, index) => (
                <li key={index}>
                  <span className="font-medium">{hours.DoctorName}:</span> {hours.TotalHoursWorked || 0} hours
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentAnalytics;