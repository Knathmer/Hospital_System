import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarPatient from "../../components/users/patient/sections/header/NavbarPatient";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/patientComponents/BillingTabs/BillingTabsExports";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/patientComponents/BillingCards/BillingCardExports";
import {
  CreditCard,
  FileText,
  PieChart,
  DollarSign,
  Calendar,
  User,
  Building,
  House,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function BillingPage() {
  const [currentAndPastDueBalance, setCurrentAndPastDueBalance] = useState({
    currentBalance: 0,
    pastDueBalance: 0,
  });
  const [lastPaymentInformation, setLastPaymentInformation] = useState({
    lastPaymentAmount: "N/A",
    lastPaymentDate: "No payment made",
  });
  const [officeInformation, setOfficeInformation] = useState(null);
  const [patientInformation, setPatientInformation] = useState({});
  const [previousPayments, setPreviousPayments] = useState([]);
  const [billingStatements, setBillingStatements] = useState([]);
  const [paymentsStatements, setPaymentsStatements] = useState([]);
  const [hasMadePayments, setHasMadePayments] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("yearToDate");
  const [paymentsFilter, setPaymentsFilter] = useState("yearToDate");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeApplied, setDateRangeApplied] = useState(false);

  const fetchBalanceSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/auth/patient/billing/current-balance",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const lastPaymentResponse = await axios.get(
        "http://localhost:3000/auth/patient/billing/last-payment-summary",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const balanceData = response.data.currentAndPastDueBalance || {
        currentBalance: 0,
        pastDueBalance: 0,
      };
      const lastPaymentData = lastPaymentResponse.data.lastPayment || {
        lastPaymentAmount: "N/A",
        lastPaymentDate: "No payment made",
      };

      setCurrentAndPastDueBalance(balanceData);
      setLastPaymentInformation(lastPaymentData);

      // Check balanceData directly
      if (balanceData.currentBalance > 0 || balanceData.pastDueBalance > 0) {
        await fetchOfficeInformation();
      } else {
        setOfficeInformation(null);
      }
    } catch (error) {
      console.error("Error fetching current and past due balances:", error);
    }
  };

  const fetchPatientInformation = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/auth/patient/billing/patient-information",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPatientInformation(response.data.patientInfo);
    } catch (error) {
      console.error("Error fetching patient information:", error);
    }
  };
  const fetchOfficeInformation = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/auth/patient/billing/office-information",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const officeInfo = response.data.officeInfo || null;
      setOfficeInformation(officeInfo);
    } catch (error) {
      console.error("Error fetching office information:", error);
    }
  };
  const fetchRecentPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/auth/patient/billing/recent-payments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.recentPayments.length === 0) {
        setPreviousPayments([]);
        setHasMadePayments(false);
      } else {
        setPreviousPayments(response.data.recentPayments);
        setHasMadePayments(true);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const fetchBillingStatements = async () => {
    try {
      const token = localStorage.getItem("token");
      let url;
      let dataKey = "statements"; // Default key

      switch (selectedFilter) {
        case "yearToDate":
          url = "http://localhost:3000/auth/patient/billing/details/ytd";
          dataKey = "detailsYTD";
          break;
        case "lastYear":
          url = "http://localhost:3000/auth/patient/billing/details/last-year";
          dataKey = "detailsLastYear";
          break;
        case "dateRange":
          if (!startDate || !endDate) {
            // Do not fetch if dates are not set
            return;
          }
          url = `http://localhost:3000/auth/patient/billing/details/date-range?startDate=${startDate}&endDate=${endDate}`;
          dataKey = "detailsDateRange";
          break;
        default:
          url = "http://localhost:3000/auth/patient/billing/details/ytd";
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("Billing Statements Response:", response.data);

      setBillingStatements(response.data[dataKey] || []);
    } catch (error) {
      console.error("Error fetching billing statements:", error);
    }
  };

  //Fetch data when a filter changes.
  useEffect(() => {
    if (selectedFilter === "dateRange" && dateRangeApplied) {
      if (startDate && endDate) {
        fetchBillingStatements();
      }
    } else if (selectedFilter !== "dateRange") {
      fetchBillingStatements();
    }
  }, [selectedFilter, dateRangeApplied, startDate, endDate]);

  useEffect(() => {
    setDateRangeApplied(false);
  }, [selectedFilter]);

  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      setDateRangeApplied(true);
    } else {
      alert("Please select both start and end dates.");
    }
  };

  //useEffect for the 'Overview' tab
  useEffect(() => {
    const fetchData = async () => {
      await fetchBalanceSummary();
      await fetchPatientInformation();
      await fetchRecentPayments();
    };

    fetchData();
  }, []);

  //-------------Payments Fetch Functions and Hooks-----------------\\

  const fetchPaymentsTabStatements = async () => {
    try {
      const token = localStorage.getItem("token");
      let url;
      let dataKey;

      switch (paymentsFilter) {
        case "yearToDate":
          url = "http://localhost:3000/auth/patient/billing/payments/ytd";
          dataKey = "paymentsYTD";
          break;
        case "lastYear":
          url = "http://localhost:3000/auth/patient/billing/payments/last-year";
          dataKey = "paymentsLastYear";
          break;
        case "dateRange":
          if (!startDate || !endDate) {
            // Do not fetch if dates are not set
            return;
          }
          url = `http://localhost:3000/auth/patient/billing/payments/date-range?startDate=${startDate}&endDate=${endDate}`;
          dataKey = "paymentsDateRange";
          break;
        default:
          url = "http://localhost:3000/auth/patient/billing/payments/ytd";
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPaymentsStatements(response.data[dataKey] || []);
    } catch (error) {
      console.error("Error fetching payment statements:", error);
    }
  };

  useEffect(() => {
    if (paymentsFilter === "dateRange" && dateRangeApplied) {
      if (startDate && endDate) {
        fetchPaymentsTabStatements();
      }
    } else if (paymentsFilter !== "dateRange") {
      fetchPaymentsTabStatements();
    }
  }, [paymentsFilter, dateRangeApplied, startDate, endDate]);

  const date = new Date("2024-08-14");
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarPatient linkTo={"/patient/dashboard"} />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Billing</h1>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="flex space-x-1 rounded-xl bg-gray-200 p-1">
              <TabsTrigger
                value="overview"
                className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-pink-600 focus:outline-none focus:ring-2 aria-selected:bg-white aria-selected:shadow aria-selected:text-pink-600"
              >
                <PieChart className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-pink-600 focus:outline-none focus:ring-2 aria-selected:bg-white aria-selected:shadow aria-selected:text-pink-600"
              >
                <FileText className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-pink-600 focus:outline-none focus:ring-2 aria-selected:bg-white aria-selected:shadow aria-selected:text-pink-600"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card className="overflow-hidden shadow-lg rounded-lg">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Balance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Current Balance
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            ${currentAndPastDueBalance.currentBalance}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Past Due Balance
                          </p>
                          <p
                            className={`text-2xl font-bold ${
                              currentAndPastDueBalance.pastDueBalance > 0
                                ? "text-red-600"
                                : "text-gray-800"
                            }`}
                          >
                            ${currentAndPastDueBalance.pastDueBalance}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Last Payment Amount
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {lastPaymentInformation.lastPaymentAmount === "N/A"
                              ? lastPaymentInformation.lastPaymentAmount
                              : `$${lastPaymentInformation.lastPaymentAmount}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Last Payment Date
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {lastPaymentInformation.lastPaymentDate !==
                            "No payment made"
                              ? new Date(
                                  lastPaymentInformation.lastPaymentDate
                                ).toLocaleDateString("en-US", {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                              : lastPaymentInformation.lastPaymentDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden shadow-lg rounded-lg">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Recent Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        {previousPayments.map((payment) => (
                          <li
                            key={payment.paymentID}
                            className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-center">
                              <Calendar className="w-5 h-5 mr-3 text-pink-600" />
                              <span className="text-gray-700">
                                {new Date(
                                  payment.paymentDate
                                ).toLocaleDateString("en-US", {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-800">
                              ${payment.amount}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="overflow-hidden shadow-lg rounded-lg">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <User className="w-5 h-5 mr-3 mt-1 text-pink-600" />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {patientInformation.firstName +
                                " " +
                                patientInformation.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              DOB:{" "}
                              {new Date(
                                patientInformation.dateOfBirth
                              ).toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <House className="w-5 h-5 mr-3 mt-1 text-pink-600" />
                          <p className="text-sm text-gray-700">
                            {patientInformation.addrStreet +
                              ", " +
                              patientInformation.addrcity +
                              " " +
                              patientInformation.addrState +
                              ", " +
                              patientInformation.addrZip}
                          </p>
                        </li>
                        <li className="flex items-center">
                          <Phone className="w-5 h-5 mr-3 text-pink-600" />
                          <p className="text-sm text-gray-700">
                            {patientInformation.phoneNumber
                              ? patientInformation.phoneNumber.slice(0, 3) +
                                "-" +
                                patientInformation.phoneNumber.slice(3, 6) +
                                "-" +
                                patientInformation.phoneNumber.slice(6)
                              : "N/A"}
                          </p>
                        </li>
                        <li className="flex items-center">
                          <Mail className="w-5 h-5 mr-3 text-pink-600" />
                          <p className="text-sm text-gray-700">
                            {patientInformation.email}
                          </p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {officeInformation && (
                    <Card className="overflow-hidden shadow-lg rounded-lg">
                      <CardHeader className="bg-gray-50 border-b border-gray-200">
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Office Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <Building className="w-5 h-5 mr-3 mt-1 text-pink-600" />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {officeInformation.officeName}
                              </p>
                              <p className="text-sm text-gray-700">
                                {officeInformation.addrStreet},{" "}
                                {officeInformation.addrcity}{" "}
                                {officeInformation.addrState},{" "}
                                {officeInformation.addrZip}
                              </p>
                            </div>
                          </li>
                          <li className="flex items-center">
                            <Phone className="w-5 h-5 mr-3 text-pink-600" />
                            <p className="text-sm text-gray-700">
                              {officeInformation.officePhoneNumber
                                ? `${officeInformation.officePhoneNumber.slice(
                                    0,
                                    3
                                  )}-${officeInformation.officePhoneNumber.slice(
                                    3,
                                    6
                                  )}-${officeInformation.officePhoneNumber.slice(
                                    6
                                  )}`
                                : "N/A"}
                            </p>
                          </li>
                          <li className="flex items-center">
                            <Mail className="w-5 h-5 mr-3 text-pink-600" />
                            <p className="text-sm text-gray-700">
                              {officeInformation.officeEmail}
                            </p>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === "yearToDate"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedFilter("yearToDate")}
                  >
                    Year to Date
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === "lastYear"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedFilter("lastYear")}
                  >
                    Last Year
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === "dateRange"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedFilter("dateRange")}
                  >
                    Date Range
                  </button>
                </div>
                {selectedFilter === "dateRange" && (
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        value={startDate || ""}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        value={endDate || ""}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <button
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      onClick={handleDateRangeSubmit}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
              <Card className="mt-6 overflow-hidden shadow-lg rounded-lg">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Billing Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {billingStatements.length > 0 ? (
                    billingStatements.map((statement) => {
                      const date = new Date(statement.visitDate);
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      });
                      const day = date.getDate();
                      const year = date.getFullYear();

                      let statusColor;
                      switch (statement.paidStatus) {
                        case "Paid":
                          statusColor = "bg-green-100 text-green-800";
                          break;
                        case "Partially Paid":
                          statusColor = "bg-yellow-100 text-yellow-800";
                          break;
                        case "Overdue":
                          statusColor = "bg-red-100 text-red-800";
                          break;
                        default:
                          statusColor = "bg-gray-100 text-gray-800";
                      }

                      return (
                        <div
                          key={statement.billID}
                          className="border rounded-lg p-6 mb-6 shadow-sm"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_200px] gap-6">
                            <div className="text-center">
                              <div className="text-pink-600 text-lg font-medium">
                                {month}
                              </div>
                              <div className="text-3xl font-bold text-pink-600">
                                {day}
                              </div>
                              <div className="text-pink-600">{year}</div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-gray-800">
                                {statement.visitType}
                              </h3>
                              <p className="text-gray-600">
                                {statement.serviceName}
                              </p>
                              <div className="space-y-1 text-sm text-gray-700">
                                <p>
                                  Provider:{" "}
                                  {statement.doctorFirstName +
                                    " " +
                                    statement.doctorLastName}
                                </p>
                                <p>
                                  Patient:{" "}
                                  {statement.patientFirstName +
                                    " " +
                                    statement.patientLastName}
                                </p>
                                <p>
                                  Primary Payer:{" "}
                                  {statement.insuranceName || "None"}
                                </p>
                              </div>
                            </div>

                            <div className="text-right space-y-2">
                              <div
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                {statement.paidStatus}
                              </div>
                              <div className="space-y-1">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Billed
                                  </p>
                                  <p className="text-lg font-semibold text-gray-800">
                                    ${statement.billedAmount}
                                  </p>
                                </div>
                                {statement.insuranceCoveredAmount !==
                                  "0.00" && (
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Insurance Covered
                                    </p>
                                    <p className="text-lg font-semibold text-green-600">
                                      - ${statement.insuranceCoveredAmount}
                                    </p>
                                  </div>
                                )}
                                {statement.paidAmount !== "0.00" && (
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Payments Made
                                    </p>
                                    <p className="text-lg font-semibold text-green-600">
                                      - ${statement.paidAmount}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    Your Balance
                                  </p>
                                  <p className="text-xl font-bold text-gray-800">
                                    ${statement.balance}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No details for current date range
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/*----------------------------PAYMENTS VIEW------------------------------------ */}
            <TabsContent value="payments">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      paymentsFilter === "yearToDate"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setPaymentsFilter("yearToDate")}
                  >
                    Year to Date
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      paymentsFilter === "lastYear"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setPaymentsFilter("lastYear")}
                  >
                    Last Year
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      paymentsFilter === "dateRange"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setPaymentsFilter("dateRange")}
                  >
                    Date Range
                  </button>
                </div>
                {paymentsFilter === "dateRange" && (
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        value={startDate || ""}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        value={endDate || ""}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <button
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      onClick={handleDateRangeSubmit}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
              <Card className="overflow-hidden shadow-lg rounded-lg">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Payment History
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  {paymentsStatements.length > 0 ? (
                    paymentsStatements.map((statement) => {
                      const date = new Date(statement.paymentDate);
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      });
                      const day = date.getDate();
                      const year = date.getFullYear();
                      return (
                        <div
                          key={statement.paymentID}
                          className="flex items-start justify-between"
                        >
                          <div className="flex gap-6">
                            {/* Date Column */}
                            <div className="text-center w-16">
                              <div className="text-pink-500 text-lg font-medium">
                                {month}
                              </div>
                              <div className="text-3xl font-bold text-pink-500">
                                {day}
                              </div>
                              <div className="text-pink-500">{year}</div>
                            </div>

                            {/* Details Column */}
                            <div className="space-y-1">
                              {statement.payerType === "Patient" ? (
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Out-of-Pocket Payment
                                </h3>
                              ) : (
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Co-Payment
                                </h3>
                              )}
                              <p className="text-sm text-gray-600">
                                Display which office they made the payment
                              </p>
                            </div>
                          </div>

                          {/* Amount Column */}
                          <div className="text-xl font-bold text-gray-900">
                            ${statement.amount}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No payments made in current date range
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
