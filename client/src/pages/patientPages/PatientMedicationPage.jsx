import React, { useState, useEffect } from "react";
import axios from "axios";
import { Printer, Info, Trash2 } from "lucide-react";
import MedicationCard from "../../components/patientComponents/MedicationCard.jsx";

export default function PrescriptionPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("token");

        //If no token is found it means that the user is not authenticated.
        if (!token) {
          setError("User is not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/auth/patient/medications",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMedications(response.data.patientMedicationInformation);
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
    fetchMedications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading medications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white border-b">
        <button className="p-1 rounded hover:bg-pink-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-pink-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-pink-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="ml-2 text-xl font-bold">PatientPortal</span>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600">
              Medications
            </h1>
            <button className="flex items-center text-pink-600 hover:text-pink-700">
              <Printer className="w-5 h-5 mr-2" />
              Print
            </button>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl mb-4 text-pink-600">
              Current Medications
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please review your medications, and verify that the list is up to
              date.{" "}
              <span className="text-red-600">
                If you are experiencing an urgent or life-threatening medical
                emergency, please call 911.
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Please understand that any changes you request to your clinical
              information do not immediately occur. Changes must be reviewed and
              reconciled by your Houston Methodist health care provider. It is
              common that this clinical review will take place at your next
              scheduled appointment.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Need to update your list of pharmacies?{" "}
              <a href="#" className="text-pink-600 hover:underline">
                Go to Manage My Pharmacies.
              </a>
            </p>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-700 disabled:pointer-events-none disabled:opacity-50">
              Request refills
            </button>
            {medications && medications.length > 0 ? (
              medications.map((med, index) => (
                <MedicationCard
                  key={index}
                  name={med.medicationName}
                  instructions={med.instruction}
                  prescriptionDetails={{
                    prescribed: new Date(med.start).toLocaleDateString(
                      "en-US",
                      {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }
                    ),
                    approvedBy: `${med.firstName} ${med.lastName}`,
                  }}
                  refillDetails={{
                    quantity: med.quantity,
                    daySupply: med.daySupply,
                  }}
                />
              ))
            ) : (
              <p>No Medication Found.</p>
            )}
            <div className="mt-6 pt-6 border-t">
              <button className="flex items-center text-pink-600 hover:text-pink-700 hover:underline">
                <span className="text-xl mr-2">+</span> Report a medication
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} WomenWell. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a
            href="#"
            className="text-xs text-pink-600 hover:text-pink-700 hover:underline underline-offset-4"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-xs text-pink-600 hover:text-pink-700 hover:underline underline-offset-4"
          >
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
