// ManageRefillsPage.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import NavbarPatient from "../../components/users/patient/sections/header/NavbarPatient";
import Footer from "../../components/ui/Footer";
import TabButton from "../../components/patientComponents/TabButton";
import axios from "axios";
import RequestRefills from "../../components/patientComponents/RequestRefills";
import RefillHistory from "../../components/patientComponents/RefillHistory";

import envConfig from "../../envConfig";

export default function ManageRefillsPage() {
  // State Management
  const [patientsCurrentPrescriptions, setPatientsCurrentPrescriptions] =
    useState([]);
  const [selectedRefills, setSelectedRefills] = useState([]);
  const [refillHistory, setRefillHistory] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refillLoading, setRefillLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const tabs = [
    { id: "request", label: "Request Refills" },
    { id: "history", label: "Refill History" },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab).id === "request"
      ? RequestRefills
      : RefillHistory;

  // Fetch Current Prescriptions
  const fetchCurrentPrescriptions = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Patient is not authorized");
        return;
      }

      const response = await axios.get(
        `${envConfig.apiUrl}/auth/patient/medications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPatientsCurrentPrescriptions(
        response.data.patientMedicationInformation
      );
    } catch (error) {
      console.error("Error fetching medications: ", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Session expired. Please log in again");
      } else {
        setErrorMessage("Error fetching medications");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch Refill History
  const fetchRefillHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("User is not authorized!");
        return;
      }

      const response = await axios.get(
        `${envConfig.apiUrl}/auth/patient/medications/refill-history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRefillHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching previous refills:", error);
      setErrorMessage("Error fetching previous refills.");
    }
  };

  // Initial Data Fetching
  useEffect(() => {
    fetchCurrentPrescriptions();
    fetchRefillHistory();
    fetchPendingRequests();
  }, []);

  // Handle Selecting a Refill
  const handleSelectRefill = (medication) => {
    if (medication.refillCount === 0) {
      setErrorMessage("Cannot refill this prescription. No refills remaining");
      return;
    }

    if (
      !selectedRefills.find(
        (item) => item.prescriptionID === medication.prescriptionID
      )
    ) {
      setSelectedRefills([...selectedRefills, medication]);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Patient is not authenticated!");
        return;
      }

      const response = await axios.get(
        `${envConfig.apiUrl}/auth/patient/medications/pending-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingRequests(response.data.pendingRequest);
    } catch (error) {
      console.error("Error fetching pending refill requests:", error);
      setErrorMessage("Error fetching pending refill requests.");
    }
  };

  // Handle Unselecting a Refill
  const handleUnselectRefill = (prescriptionID) => {
    const refillToRemove = selectedRefills.find(
      (refill) => refill.prescriptionID === prescriptionID
    );

    if (refillToRemove) {
      const updatedSelectedRefills = selectedRefills.filter(
        (refill) => refill.prescriptionID !== prescriptionID
      );
      setSelectedRefills(updatedSelectedRefills);
    }
  };

  // Handle Requesting Refills
  const handleRequestRefills = async () => {
    try {
      setRefillLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Patient is not authorized");
        return;
      }

      const prescriptionIDs = selectedRefills.map(
        (refill) => refill.prescriptionID
      );

      const response = await axios.post(
        `${envConfig.apiUrl}/auth/patient/medications/refill`,
        { prescriptionIDs },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setSelectedRefills([]);

        // Refresh Data
        await fetchRefillHistory();
        await fetchCurrentPrescriptions();
      }
    } catch (error) {
      console.error("Error submitting refill requests: ", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error submitting refill requests. Please try again.");
      }
    } finally {
      setRefillLoading(false);
    }
  };

  // Implement Auto-Dismiss for Error and Success Messages
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 6000); // 6 seconds

      // Cleanup the timer if the component unmounts or if errorMessage changes
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 8000); // 8 seconds

      // Cleanup the timer if the component unmounts or if successMessage changes
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <NavbarPatient linkTo="/dashboard" />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-black mb-2">
              Manage Refills
            </h1>

            <Link
              to=".."
              className="flex items-center text-pink-600 hover:text-pink-700 mt-2"
            >
              <ArrowLeft className="w-6 h-4 mr-2" />
              Back to Medications
            </Link>

            {/* Display Error and Success Messages */}
            <div className="mb-4">
              {errorMessage && (
                <p className="text-red-700 bg-red-100 border border-red-400 rounded p-4 mb-4">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-green-700 bg-green-100 border border-green-400 rounded p-4 mb-4">
                  {successMessage}
                </p>
              )}
            </div>
            <div className="mb-4 border-b border-gray-200">
              <div className="flex flex-wrap -mb-px">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    label={tab.label}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </div>
            </div>

            {activeTab === "request" ? (
              <RequestRefills
                patientsCurrentPrescriptions={patientsCurrentPrescriptions}
                selectedRefills={selectedRefills}
                pendingRequests={pendingRequests}
                handleSelectRefill={handleSelectRefill}
                handleUnselectRefill={handleUnselectRefill}
                handleRequestRefills={handleRequestRefills}
                refillLoading={refillLoading}
                loading={loading}
              />
            ) : (
              <RefillHistory refillHistory={refillHistory} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
