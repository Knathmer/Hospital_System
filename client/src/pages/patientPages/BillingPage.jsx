import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Phone,
  Mail,
} from "lucide-react";

export default function BillingPage() {
  const [currentAndPastDueBalance, setCurrentAndPastDueBalance] = useState([]);

  const fetchCurrentAndPastDueBalances = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/auth/patient/billing/current-balance",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentAndPastDueBalance(response.data.currentAndPastDueBalance);
    } catch (error) {
      console.error("Error fetching current and past due balances:", error);
      // Optionally, you can set an error state to display an error message to the user
    }
  };

  useEffect(() => {
    fetchCurrentAndPastDueBalances();
  }, []);

  //Get the current and past due balance from the api request which is stored in the state variable.
  const currentBalance =
    currentAndPastDueBalance && currentAndPastDueBalance[0]?.currentBalance;
  const pastDueBalance =
    currentAndPastDueBalance && currentAndPastDueBalance[0]?.pastDueBalance;

  const balanceData = {
    currentBalance: 500.0,
    pastDueBalance: 150.0,
    lastPaymentAmount: 200.0,
    lastPaymentDate: "2023-06-15",
  };

  const recentPayments = [
    { id: 1, date: "2023-06-15", amount: 200.0 },
    { id: 2, date: "2023-05-20", amount: 150.0 },
    { id: 3, date: "2023-04-18", amount: 300.0 },
  ];

  const patientInfo = {
    name: "Jane Doe",
    dob: "1985-03-22",
    address: "123 Main St, Anytown, USA 12345",
    phone: "(555) 123-4567",
    email: "jane.doe@example.com",
  };

  const officeInfo = {
    name: "Health & Wellness Clinic",
    address: "456 Medical Ave, Healthville, USA 67890",
    phone: "(555) 987-6543",
    email: "info@healthwellness.com",
  };

  return (
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
                      <p className="text-sm text-gray-500">Current Balance</p>
                      <p className="text-2xl font-semibold">
                        ${currentBalance}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Past Due Balance</p>
                      <p className="text-2xl font-semibold text-red-600">
                        ${pastDueBalance}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Last Payment Amount
                      </p>
                      <p className="text-2xl font-semibold">
                        ${balanceData.lastPaymentAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Payment Date</p>
                      <p className="text-2xl font-semibold">
                        {balanceData.lastPaymentDate}
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
                    {recentPayments.map((payment) => (
                      <li
                        key={payment.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{payment.date}</span>
                        </div>
                        <span className="font-semibold">
                          ${payment.amount.toFixed(2)}
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
                        <p className="font-semibold">{patientInfo.name}</p>
                        <p className="text-sm text-gray-500">
                          DOB: {patientInfo.dob}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Building className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                      <p className="text-sm">{patientInfo.address}</p>
                    </li>
                    <li className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-sm">{patientInfo.phone}</p>
                    </li>
                    <li className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-sm">{patientInfo.email}</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Building className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                      <div>
                        <p className="font-semibold">{officeInfo.name}</p>
                        <p className="text-sm">{officeInfo.address}</p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-sm">{officeInfo.phone}</p>
                    </li>
                    <li className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-sm">{officeInfo.email}</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Billing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed billing information will be displayed here.</p>
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
  );
}
