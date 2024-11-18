// FinancialOverviewPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar, Line } from "react-chartjs-2";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
// import { useHistory } from "react-router-dom";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
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
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  // const history = useHistory();

  useEffect(() => {
    fetchFinancialData();
    fetchFilterOptions();
  }, []);

  // Reset expandedRows when data changes
  useEffect(() => {
    setExpandedRows({});
  }, [data]);

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = {};

      if (filters.startDate) {
        params.startDate = filters.startDate.toISOString().split("T")[0];
      }
      if (filters.endDate) {
        params.endDate = filters.endDate.toISOString().split("T")[0];
      }
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

        paymentStatusCounts[item.paidStatus] =
          (paymentStatusCounts[item.paidStatus] || 0) + 1;
      });

      setSummary({
        totalRevenue: totalRevenue.toFixed(2),
        totalAppointments,
        totalOutstanding: totalOutstanding.toFixed(2),
        paymentStatusCounts,
      });

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

  const handleResetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      doctorID: "",
      officeID: "",
      serviceID: "",
      paymentStatus: "",
      patientName: "",
    });
    fetchFinancialData();
  };

  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  const toggleRowExpansion = (appointmentID) => {
    setExpandedRows((prev) => ({
      ...prev,
      [appointmentID]: !prev[appointmentID],
    }));
  };

  const revenueByServiceChartData = {
    labels: revenueByService.map((item) => item.serviceName),
    datasets: [
      {
        label: "Revenue",
        data: revenueByService.map((item) => item.totalRevenue),
        backgroundColor: "rgba(236, 72, 153, 0.6)",
      },
    ],
  };

  const monthlyRevenueChartData = {
    labels: monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue.map((item) => item.totalRevenue),
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <button
        onClick={handleBackClick}
        className="mb-4 text-pink-600 hover:text-pink-800 focus:outline-none flex items-center"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Financial Overview
      </h1>

      <form
        onSubmit={handleFilterSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => handleDateChange(date, "startDate")}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholderText="Select start date"
              wrapperClassName="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => handleDateChange(date, "endDate")}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholderText="Select end date"
              wrapperClassName="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <select
              name="doctorID"
              value={filters.doctorID}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.doctorID} value={doctor.doctorID}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Office
            </label>
            <select
              name="officeID"
              value={filters.officeID}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">All Offices</option>
              {offices.map((office) => (
                <option key={office.officeID} value={office.officeID}>
                  {office.officeName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select
              name="serviceID"
              value={filters.serviceID}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service.serviceID} value={service.serviceID}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <Input
              name="patientName"
              value={filters.patientName}
              onChange={handleFilterChange}
              placeholder="Enter patient name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <Button
            type="submit"
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Apply Filters
          </Button>
          <Button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Reset Filters
          </Button>
        </div>
      </form>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Revenue
          </h2>
          <p className="text-3xl font-bold text-pink-600">
            ${summary.totalRevenue}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Appointments
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {summary.totalAppointments}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Outstanding
          </h2>
          <p className="text-3xl font-bold text-red-600">
            ${summary.totalOutstanding}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Paid", "Partially Paid", "Pending", "Overdue"].map((status) => (
          <div key={status} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {status}
            </h2>
            <p className="text-2xl font-bold text-gray-800">
              {summary.paymentStatusCounts[status] || 0}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Revenue by Service
          </h2>
          <Bar data={revenueByServiceChartData} />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Monthly Revenue
          </h2>
          <Line data={monthlyRevenueChartData} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                {[
                  "Appointment Date",
                  "Patient",
                  "Doctor",
                  "Service",
                  "Service Price",
                  "Additional Charges",
                  "Custom Charges",
                  "Total Bill Amount",
                  "Insurance Covered",
                  "Paid Amount",
                  "Payment Status",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <React.Fragment key={`${item.appointmentID}-${index}`}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRowExpansion(item.appointmentID)}
                          className="text-pink-600 hover:text-pink-800 focus:outline-none"
                        >
                          {expandedRows[item.appointmentID] ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.appointmentDateTime
                          ? new Date(
                              item.appointmentDateTime
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.patientName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.doctorName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.serviceName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.servicePrice != null
                          ? `$${parseFloat(item.servicePrice).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.totalAdditionalCharges != null
                          ? `$${parseFloat(item.totalAdditionalCharges).toFixed(
                              2
                            )}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.totalCustomCharges != null
                          ? `$${parseFloat(item.totalCustomCharges).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.totalBillAmount != null
                          ? `$${parseFloat(item.totalBillAmount).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.insuranceCoveredAmount != null
                          ? `$${parseFloat(item.insuranceCoveredAmount).toFixed(
                              2
                            )}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.paidAmount != null
                          ? `$${parseFloat(item.paidAmount).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.paidStatus === "Paid"
                              ? "bg-green-100 text-green-800"
                              : item.paidStatus === "Partially Paid"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.paidStatus === "Pending"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.paidStatus || "-"}
                        </span>
                      </td>
                    </tr>
                    {expandedRows[item.appointmentID] && (
                      <tr>
                        <td colSpan="12" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Additional Charges Details
                              </h3>
                              {item.additionalChargesDetails ? (
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {item.additionalChargesDetails
                                    .split(", ")
                                    .map((detail, idx) => (
                                      <li key={idx}>{detail}</li>
                                    ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-600">
                                  No additional charges.
                                </p>
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Custom Charges Details
                              </h3>
                              {item.customChargesDetails ? (
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {item.customChargesDetails
                                    .split(", ")
                                    .map((detail, idx) => (
                                      <li key={idx}>{detail}</li>
                                    ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-600">
                                  No custom charges.
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
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
    </div>
  );
}
