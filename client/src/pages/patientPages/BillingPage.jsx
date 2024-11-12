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
  const [hasMadePayments, setHasMadePayments] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("yearToDate");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
      let dataKey = "statements";

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
          url = `http://localhost:3000/auth/patient/billing/details/date-range?startDate=${startDate}&endDate=${endDate}`;
          break;
        default:
          url = "http://localhost:3000/auth/patient/billing/details/ytd";
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Billing Statements Response:", response.data);

      setBillingStatements(response.data[dataKey] || []);
    } catch (error) {
      console.error("Error fetching billing statements:", error);
    }
  };

  //Fetch data when a filter changes.
  useEffect(() => {
    fetchBillingStatements();
  }, [selectedFilter, startDate, endDate]);

  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      fetchBillingStatements();
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarPatient linkTo={"/patient/dashboard"} />
      <main>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Billing</h1>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger
                value="overview"
                className="flex items-center justify-center border-b-2 border-transparent hover:border-gray-300"
              >
                <PieChart className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="flex items-center justify-center border-b-2 border-transparent hover:border-gray-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="flex items-center justify-center border-b-2 border-transparent hover:border-gray-300"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Balance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Current Balance
                          </p>
                          <p className="text-2xl font-semibold">
                            ${currentAndPastDueBalance.currentBalance}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Past Due Balance
                          </p>
                          <p
                            className={
                              currentAndPastDueBalance.pastDueBalance > 0
                                ? `text-2xl font-semibold text-red-600`
                                : `text-2xl font-semibold text-black`
                            }
                          >
                            ${currentAndPastDueBalance.pastDueBalance}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Last Payment Amount
                          </p>
                          <p className="text-2xl font-semibold">
                            {lastPaymentInformation.lastPaymentAmount === "N/A"
                              ? lastPaymentInformation.lastPaymentAmount
                              : `$${lastPaymentInformation.lastPaymentAmount}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Last Payment Date
                          </p>
                          <p className="text-2xl font-semibold">
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {previousPayments.map((payment) => (
                          <li
                            key={payment.paymentID}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>
                                {new Date(
                                  payment.paymentDate
                                ).toLocaleDateString("en-US", {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <span className="font-semibold">
                              ${payment.amount}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <User className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                          <div>
                            <p className="font-semibold">
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
                          <House className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                          <p className="text-sm">
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
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <p className="text-sm">
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
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <p className="text-sm">{patientInformation.email}</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {officeInformation && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Office Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Building className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                            <div>
                              <p className="font-semibold">
                                {officeInformation.officeName}
                              </p>
                              <p className="text-sm">
                                {officeInformation.addrStreet},{" "}
                                {officeInformation.addrcity}{" "}
                                {officeInformation.addrState},{" "}
                                {officeInformation.addrZip}
                              </p>
                            </div>
                          </li>
                          <li className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            <p className="text-sm">
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
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <p className="text-sm">
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
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded ${
                      selectedFilter === "yearToDate"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedFilter("yearToDate")}
                  >
                    Year to Date
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      selectedFilter === "lastYear"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedFilter("lastYear")}
                  >
                    Last Year
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      selectedFilter === "dateRange"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedFilter("dateRange")}
                  >
                    Date Range
                  </button>
                </div>
                {selectedFilter === "dateRange" && (
                  <div className="flex space-x-4 mt-4">
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      value={startDate || ""}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      value={endDate || ""}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded"
                      onClick={handleDateRangeSubmit}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Billing Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {billingStatements.length > 0 ? (
                    billingStatements.map((statement) => {
                      // Get the month, day, and year from the API call.
                      const date = new Date(statement.visitDate);
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      }); // e.g., "Nov"
                      const day = date.getDate(); // Day as a number, e.g., 11
                      const year = date.getFullYear(); // Full year, e.g., 2024

                      let backgroundColor;

                      switch (statement.paidStatus) {
                        case "Paid":
                          backgroundColor = "emerald";
                          break;
                        case "Partially Paid":
                          backgroundColor = "yellow";
                          break;
                        case "Overdue":
                          backgroundColor = "red";
                          break;
                        default:
                          backgroundColor = "emerald";
                      }

                      return (
                        <div
                          key={statement.billID}
                          className="border rounded-lg p-6 mb-4"
                        >
                          <div className="grid grid-cols-[100px_1fr_200px] gap-4">
                            {/* Date Column */}
                            <div className="text-center">
                              <div className="text-pink-600 text-lg font-medium">
                                {month}
                              </div>
                              <div className="text-3xl font-bold text-pink-600">
                                {day}
                              </div>
                              <div className="text-pink-600">{year}</div>
                            </div>

                            {/* Details Column */}
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold">
                                {statement.visitType}
                              </h3>
                              <p className="text-muted-foreground">
                                {statement.serviceName}
                              </p>
                              <div className="space-y-1">
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

                            {/* Amount Column */}
                            <div className="text-right space-y-2">
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-${backgroundColor}-100 text-black`}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                {statement.paidStatus}
                              </div>
                              <div className="space-y-1">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Billed
                                  </p>
                                  <p className="text-lg font-semibold">
                                    ${statement.billedAmount}
                                  </p>
                                </div>
                                {statement.insuranceCoveredAmount !==
                                  "0.00" && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Insurance Covered
                                    </p>
                                    <p className="text-lg font-semibold text-emerald-600">
                                      - ${statement.insuranceCoveredAmount}
                                    </p>
                                  </div>
                                )}
                                {statement.paidAmount !== "0.00" && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Payments Made
                                    </p>
                                    <p className="text-lg font-semibold text-emerald-600">
                                      - ${statement.paidAmount}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium">
                                    Your Balance
                                  </p>
                                  <p className="text-xl font-bold">
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
                    <p>No details for current date range</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>A comprehensive payment history will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
