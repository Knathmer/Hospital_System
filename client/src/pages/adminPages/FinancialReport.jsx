// FinancialOverviewPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FinancialOverviewPage() {
  const [data, setData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    doctorID: "",
    officeID: "",
    serviceID: "",
    paymentStatus: "",
    patientName: "",
  });
  const [summary, setSummary] = useState({
    totalRevenue: "0.00",
    totalAppointments: 0,
    totalOutstanding: "0.00",
    paymentStatusCounts: {},
  });
  const [revenueByService, setRevenueByService] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    fetchFinancialData();
    fetchFilterOptions();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = {};

      // Date handling
      if (filters.startDate) {
        params.startDate = filters.startDate.toISOString().split("T")[0];
      }

      if (filters.endDate) {
        params.endDate = filters.endDate.toISOString().split("T")[0];
      }

      // Other filters
      if (filters.doctorID) {
        params.doctorID = filters.doctorID;
      }

      if (filters.officeID) {
        params.officeID = filters.officeID;
      }

      if (filters.serviceID) {
        params.serviceID = filters.serviceID;
      }

      if (filters.paymentStatus) {
        params.paymentStatus = filters.paymentStatus;
      }

      if (filters.patientName) {
        params.patientName = filters.patientName;
      }

      const response = await axios.get(
        "http://localhost:3000/auth/admin/billing-report/financial-overview",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      const rows = response.data.rows || [];
      const revenueServiceData = response.data.revenueByService || [];
      const monthlyRevenueData = response.data.monthlyRevenue || [];
      setData(rows);

      // Compute summary
      let totalRevenue = 0;
      let totalOutstanding = 0;
      let totalAppointments = rows.length;
      const paymentStatusCounts = {};

      rows.forEach((item) => {
        const totalBillAmount = parseFloat(item.totalBillAmount) || 0;
        const paidAmount = parseFloat(item.paidAmount) || 0;
        totalRevenue += paidAmount;

        if (item.paidStatus !== "Paid") {
          totalOutstanding += totalBillAmount - paidAmount;
        }

        // Count payment statuses
        paymentStatusCounts[item.paidStatus] =
          (paymentStatusCounts[item.paidStatus] || 0) + 1;
      });

      setSummary({
        totalRevenue: totalRevenue.toFixed(2),
        totalAppointments,
        totalOutstanding: totalOutstanding.toFixed(2),
        paymentStatusCounts,
      });

      // Set data for charts
      setRevenueByService(revenueServiceData);
      setMonthlyRevenue(monthlyRevenueData);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem("token");

      const [doctorsResponse, officesResponse, servicesResponse] =
        await Promise.all([
          axios.get("http://localhost:3000/auth/admin/billing-report/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/auth/admin/billing-report/offices", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            "http://localhost:3000/auth/admin/billing-report/services",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

      setDoctors(doctorsResponse.data.doctors || []);
      setOffices(officesResponse.data.offices || []);
      setServices(servicesResponse.data.services || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, name) => {
    setFilters((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFinancialData();
  };

  // Chart Data Preparation
  const revenueByServiceChartData = {
    labels: revenueByService.map((item) => item.serviceName),
    datasets: [
      {
        label: "Revenue",
        data: revenueByService.map((item) => item.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const monthlyRevenueChartData = {
    labels: monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue.map((item) => item.totalRevenue),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Overview</h1>

      {/* Summary Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ${summary.totalRevenue}
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Appointments
          </h2>
          <p className="text-2xl font-bold text-blue-600">
            {summary.totalAppointments}
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Outstanding
          </h2>
          <p className="text-2xl font-bold text-red-600">
            ${summary.totalOutstanding}
          </p>
        </div>
      </div>

      {/* Payment Status Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Paid", "Partially Paid", "Pending", "Overdue"].map((status) => (
          <div key={status} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold text-gray-700">{status}</h2>
            <p className="text-2xl font-bold text-gray-800">
              {summary.paymentStatusCounts[status] || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Service */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Revenue by Service
          </h2>
          <Bar data={revenueByServiceChartData} />
        </div>

        {/* Monthly Revenue */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Monthly Revenue
          </h2>
          <Line data={monthlyRevenueChartData} />
        </div>
      </div>

      {/* Filter Section */}
      <form onSubmit={handleFilterSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => handleDateChange(date, "startDate")}
              dateFormat="yyyy-MM-dd"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholderText="Select start date"
            />
          </div>
          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => handleDateChange(date, "endDate")}
              dateFormat="yyyy-MM-dd"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholderText="Select end date"
            />
          </div>
          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor
            </label>
            <select
              name="doctorID"
              value={filters.doctorID}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.doctorID} value={doctor.doctorID}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>
          {/* Office */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Office
            </label>
            <select
              name="officeID"
              value={filters.officeID}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            >
              <option value="">All Offices</option>
              {offices.map((office) => (
                <option key={office.officeID} value={office.officeID}>
                  {office.officeName}
                </option>
              ))}
            </select>
          </div>
          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service
            </label>
            <select
              name="serviceID"
              value={filters.serviceID}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service.serviceID} value={service.serviceID}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <Input
              name="patientName"
              value={filters.patientName}
              onChange={handleFilterChange}
              placeholder="Enter patient name"
            />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </form>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                Appointment Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                Doctor
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                Service
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase">
                Service Price
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                Additional Charges
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                Custom Charges
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase">
                Total Bill Amount
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase">
                Insurance Covered
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase">
                Paid Amount
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.appointmentID}>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {item.appointmentDateTime
                      ? new Date(item.appointmentDateTime).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {item.patientName || "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {item.doctorName || "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {item.serviceName || "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right">
                    {item.servicePrice != null
                      ? `$${parseFloat(item.servicePrice).toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {item.additionalCharges || "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {item.customCharges || "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right">
                    {item.totalBillAmount != null
                      ? `$${parseFloat(item.totalBillAmount).toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right">
                    {item.insuranceCoveredAmount != null
                      ? `$${parseFloat(item.insuranceCoveredAmount).toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right">
                    {item.paidAmount != null
                      ? `$${parseFloat(item.paidAmount).toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-center">
                    {item.paidStatus || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
