import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavbarPatient from "../../components/dashboards/patient/sections/header/NavbarPatient";
import axios from "axios";
import CurrentPrescriptionCard from "../../components/patientComponents/CurrentPrescriptionCard";
import SelectedRefillCard from "../../components/patientComponents/SelectedPrescriptionCard";
import PreviousRefillCard from "../../components/patientComponents/PreviousRefillCard";
import TabButton from "../../components/patientComponents/TabButton";
import Footer from "../../components/ui/Footer";

export default function RefillPrescriptionsPage() {
  const [patientsCurrentPrescriptions, setPatientsCurrentPrescriptions] =
    useState([]);
  const [selectedRefills, setSelectedRefills] = useState([]);
  const [refillHistory, setRefillHistory] = useState([]);
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
      ? RequestRefill
      : RefillHistory;

  const fetchCurrentPrescriptions = async () => {
    try {
      setLoading(true);
      setErrorMessage(""); // Clear existing errors

      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Patient is not authorized");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/auth/patient/medications",
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

  const fetchRefillHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("User is not authorized!");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/auth/patient/medications/refill-history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRefillHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching previous refills:", error);
      setErrorMessage("Error fetching previous refills.");
    }
  };

  useEffect(() => {
    fetchCurrentPrescriptions();
    fetchRefillHistory();
  }, []);

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

  const handleRequestRefills = async () => {
    try {
      setRefillLoading(true); // Start loading
      setErrorMessage(""); // Clear any existing error messages
      setSuccessMessage(""); // Clear any existing success messages

      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Patient is not authorized");
        return;
      }

      const prescriptionIDs = selectedRefills.map(
        (refill) => refill.prescriptionID
      );

      // Send refill request to the backend
      const response = await axios.post(
        "http://localhost:3000/auth/patient/medications/refill",
        { prescriptionIDs },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle response based on server response status
      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setSelectedRefills([]);

        // Fetch the latest refill history and current prescriptions
        await fetchRefillHistory();
        await fetchCurrentPrescriptions(); // Re-fetch current prescriptions to reflect updated refill counts
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
      setRefillLoading(false); // End loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-black mb-2">
              Refill Prescriptions
            </h1>
            <div className="mb-4">
              <Link
                to=".."
                className="flex items-center text-pink-600 hover:text-pink-700 mt-2"
              >
                <ArrowLeft className="w-6 h-4 mr-2" />
                Back to Medications
              </Link>
            </div>
            {/* Display error and success messages */}
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
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/3">
                <h2 className="text-xl font-semibold mb-4">
                  Current Prescriptions
                </h2>
                {patientsCurrentPrescriptions &&
                patientsCurrentPrescriptions.length > 0 ? (
                  patientsCurrentPrescriptions.map((prescription) => (
                    <CurrentPrescriptionCard
                      key={prescription.id}
                      name={prescription.medicationName}
                      dosage={prescription.dosage}
                      frequency={prescription.frequency}
                      date={new Date(prescription.start).toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
                      refillCount={prescription.refillCount}
                      prescriptionID={prescription.prescriptionID}
                      onSelectRefill={handleSelectRefill}
                    />
                  ))
                ) : (
                  <p>No Medications Available</p>
                )}
              </div>
              <div className="w-full lg:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Selected Refills</h2>
                {selectedRefills.map((refill) => (
                  <SelectedRefillCard key={refill.prescriptionID} {...refill} />
                ))}
                <button
                  className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors mt-4"
                  onClick={handleRequestRefills}
                  disabled={selectedRefills.length === 0 || refillLoading} // Disable if no refills selected or loading
                >
                  {refillLoading ? "Submitting..." : "Request Refills"}
                </button>
              </div>
              <div className="w-full lg:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Refill History</h2>
                {refillHistory && refillHistory.length > 0 ? (
                  refillHistory.map((refill) => (
                    <PreviousRefillCard
                      key={refill.refillID} // Changed to refill.refillID for uniqueness
                      name={refill.medicationName}
                      status={refill.status}
                      requestDate={new Date(
                        refill.requestDate
                      ).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    />
                  ))
                ) : (
                  <p>No Refill History Available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
