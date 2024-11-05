// ManageRefillsPage.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import NavbarPatient from "../../components/dashboards/patient/sections/header/NavbarPatient";
import Footer from "../../components/ui/Footer";
import CurrentPrescriptionCard from "../../components/patientComponents/CurrentPrescriptionCard";
import SelectedRefillCard from "../../components/patientComponents/SelectedPrescriptionCard";
import PreviousRefillCard from "../../components/patientComponents/PreviousRefillCard";
import axios from "axios";

export default function ManageRefillsPage() {
  // State Management
  const [patientsCurrentPrescriptions, setPatientsCurrentPrescriptions] =
    useState([]);
  const [selectedRefills, setSelectedRefills] = useState([]);
  const [refillHistory, setRefillHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refillLoading, setRefillLoading] = useState(false);

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

  // Fetch Refill History
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

  // Initial Data Fetching
  useEffect(() => {
    fetchCurrentPrescriptions();
    fetchRefillHistory();
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

  // Handle Unselecting a Refill
  const handleUnselectRefill = (prescriptionID) => {
    setSelectedRefills(
      selectedRefills.filter((item) => item.prescriptionID !== prescriptionID)
    );
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
        "http://localhost:3000/auth/patient/medications/refill",
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

            {/* Prescriptions and Refills Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Prescriptions */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Current Prescriptions
                  </h2>
                  {loading ? (
                    <p>Loading current prescriptions...</p>
                  ) : patientsCurrentPrescriptions.length > 0 ? (
                    patientsCurrentPrescriptions.map((prescription) => (
                      <CurrentPrescriptionCard
                        key={prescription.prescriptionID}
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

                {/* Selected Refills */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Selected Refills</h2>
                  {selectedRefills.length > 0 ? (
                    selectedRefills.map((refill) => (
                      <SelectedRefillCard
                        key={refill.prescriptionID}
                        name={refill.name}
                        dosage={refill.dosage}
                        frequency={refill.frequency}
                        date={refill.date}
                        refillCount={refill.refillCount}
                        onUnselectRefill={handleUnselectRefill} // Optional: If you want to allow unselecting
                      />
                    ))
                  ) : (
                    <p>No Refills Selected</p>
                  )}
                  <button
                    onClick={handleRequestRefills}
                    disabled={selectedRefills.length === 0 || refillLoading}
                    className="w-full mt-4 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400"
                  >
                    {refillLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Plus className="w-5 h-5 inline mr-2" />
                        Request Refills
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Refill History Section */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Refill History</h2>
                {refillHistory.length === 0 ? (
                  <p className="text-gray-600">No refill history available.</p>
                ) : (
                  refillHistory.map((refill) => (
                    <PreviousRefillCard
                      key={refill.refillID}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
