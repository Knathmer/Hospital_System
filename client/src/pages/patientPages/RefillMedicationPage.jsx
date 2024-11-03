import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Printer, ArrowLeft } from "lucide-react";
import NavbarPatient from "../../components/dashboards/patient/sections/header/NavbarPatient";
import axios from "axios";
import MedicationCard from "../../components/patientComponents/MedicationCard";
import NoMedicationsCard from "../../components/patientComponents/NoMedicationFound";

function SelectedRefillCard({ name, dosage }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
      <p className="text-sm text-gray-600">{dosage}</p>
    </div>
  );
}

export default function RefillPrescriptionsPage() {
  const [patientsCurrentPrescriptions, setPatientsCurrentPrescriptions] =
    useState([]);
  const [selectedRefills, setSelectedRefills] = useState([]);
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

  useEffect(() => {
    fetchCurrentPrescriptions();
  }, []);

  const handleSelectRefill = (medication) => {
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

      await axios.post(
        "http://localhost:3000/auth/patient/medications/refill",
        { prescriptionIDs: refillRequests },
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
          <div className="px-4 py-1 sm:px-0">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
              Refill Medications
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4">
                  Current Prescriptions
                </h2>
                {patientsCurrentPrescriptions &&
                patientsCurrentPrescriptions.length !== 0 ? (
                  patientsCurrentPrescriptions.map((medication) => (
                    <MedicationCard
                      key={medication.prescriptionID}
                      refillCard={true}
                      name={medication.medicationName}
                      instructions={medication.instruction}
                      prescriptionDetails={{
                        prescribed: new Date(
                          medication.start
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        }),
                        approvedBy: `${medication.firstName} ${medication.lastName}`,
                        quantity: medication.quantity,
                        daySupply: medication.daySupply,
                        refillsRemaining: medication.refillsRemaining,
                        refillCount: medication.refillCount,
                      }}
                      pharmacyDetails={{
                        pharmacyName: medication.pharmacyName || "NULL",
                        pharmacyAddress: medication.address || "",
                        pharmacyCity: medication.city || "",
                        pharmacyState: medication.state || "",
                        pharmacyZip: medication.zipCode || "",
                        pharmacyPhoneNum: medication.phoneNumber
                          ? medication.phoneNumber.slice(0, 3) +
                            "-" +
                            medication.phoneNumber.slice(3, 6) +
                            "-" +
                            medication.phoneNumber.slice(6)
                          : "",
                      }}
                      onRequestRefill={() => handleSelectRefill(medication)}
                    />
                  ))
                ) : (
                  <NoMedicationsCard />
                )}
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4">Selected Refills</h2>
                {selectedRefills.length > 0 ? (
                  selectedRefills.map((refill) => (
                    <SelectedRefillCard
                      key={refill.prescriptionID}
                      name={refill.medicationName}
                      dosage={refill.dosage}
                    />
                  ))
                ) : (
                  <p>No medications selected for refill.</p>
                )}
                <button
                  className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors mt-4"
                  onClick={handleRequestRefills}
                  disabled={selectedRefills.length === 0}
                >
                  Request Refills
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow-sm mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2023 WomenWell. All rights reserved.
          </p>
          <button className="flex items-center text-pink-600 hover:text-pink-700">
            <Printer className="w-5 h-5 mr-2" />
            Print
          </button>
        </div>
      </footer>
    </div>
  );
}
