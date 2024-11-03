import React from "react";
import { Link } from "react-router-dom";
import { Plus, Printer, ArrowLeft } from "lucide-react";
import NavbarPatient from "../../components/dashboards/patient/sections/header/NavbarPatient";

function MedicationCard({ name, dosage, frequency, refillCount }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
        <p className="text-sm text-gray-600">{dosage}</p>
        <p className="text-sm text-gray-600">{frequency}</p>
        <p className="text-sm text-gray-600">
          Refills remaining: {refillCount}
        </p>
      </div>
      <button className="bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-colors">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

function SelectedRefillCard({ name, dosage }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-pink-600">{name}</h3>
      <p className="text-sm text-gray-600">{dosage}</p>
    </div>
  );
}

export default function RefillPrescriptionsPage() {
  const currentPrescriptions = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      refillCount: 3,
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      refillCount: 2,
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      refillCount: 1,
    },
  ];

  const selectedRefills = [{ id: 1, name: "Lisinopril", dosage: "10mg" }];

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
                {currentPrescriptions.map((prescription) => (
                  <MedicationCard key={prescription.id} {...prescription} />
                ))}
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4">Selected Refills</h2>
                {selectedRefills.map((refill) => (
                  <SelectedRefillCard key={refill.id} {...refill} />
                ))}
                <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors mt-4">
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
