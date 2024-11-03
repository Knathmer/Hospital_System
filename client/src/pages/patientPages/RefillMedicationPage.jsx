import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavbarPatient from "../../components/dashboards/patient/sections/header/NavbarPatient";
import axios from "axios";
import CurrentPrescriptionCard from "../../components/patientComponents/CurrentPrescriptionCard";
import SelectedRefillCard from "../../components/patientComponents/SelectedPrescriptionCard";
import PreviousRefillCard from "../../components/patientComponents/PreviousRefillCard";
import Footer from "../../components/ui/Footer";

export default function RefillPrescriptionsPage() {
  const [patientsCurrentPrescriptions, setPatientsCurrentPrescriptions] =
    useState([]);
  const [selectedRefills, setSelectedRefills] = useState([]);
  const [refillHistory, setRefillHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCurrentPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Patient is not authorized");
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
        setError("Session expired. Please log in again");
      } else {
        setError("Error fetching medications");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRefillHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authorized!");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/auth/patient/medications/refill-history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRefillHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching previous refills:", error);
      setError("Error fetching previous refills.");
    }
  };

  useEffect(() => {
    fetchCurrentPrescriptions();
    fetchRefillHistory();
  }, []);

  const handleSelectRefill = (medication) => {
    if (medication.refillCount === 0) {
      // corrected
      alert("Cannot refill this prescription. No refills remaining");
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
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Patient is not authorized");
        return;
      }

      const prescriptionIDs = selectedRefills.map(
        (refill) => refill.prescriptionID
      );

      await axios.post(
        "http://localhost:3000/auth/patient/medications/refill",
        { prescriptionIDs },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Refill requests submitted successfully.");
      setSelectedRefills([]);
    } catch (error) {
      console.error("Error submitting refill requests: ", error);
      setError("Error submitting refill requests");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-pink-600 mb-2">
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
            {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
            {/* Display error if any */}
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
                  disabled={selectedRefills.length === 0} // Disable if no refills selected
                >
                  Request Refills
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
