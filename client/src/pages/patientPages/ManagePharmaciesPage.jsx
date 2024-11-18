import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import axios from "axios";
import NavbarPatient from "../../components/users/patient/sections/header/NavbarPatient.jsx";
import Footer from "../../components/ui/Footer";

export default function ManageRefillsPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch medications
  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/auth/patient/medications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedications(response.data.medications || []);
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError("Error fetching medications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleRefillRequest = async (medicationID) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      await axios.post(
        `http://localhost:3000/auth/patient/medications/refill`,
        { medicationID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Refill request sent successfully!");
      fetchMedications(); // Refresh medication list after refill request
    } catch (err) {
      console.error("Error sending refill request:", err);
      setError("Error sending refill request.");
    }
  };

  const handleBack = () => {
    navigate("/patient/dashboard?tab=medications");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading medications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient linkTo={"/patient/dashboard?tab=dashboard"} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
              Manage Refills
            </h1>
          </div>
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-pink-600 hover:text-pink-700 mt-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Medications
            </button>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl mb-4 text-black">
              Your Medications
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Request refills for your current medications below.
            </p>

            {medications.length > 0 ? (
              medications.map((medication) => (
                <div
                  key={medication.medicationID}
                  className="bg-gray-50 p-4 rounded-md mb-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {medication.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dosage: {medication.dosage}
                    </p>
                    <p className="text-sm text-gray-600">
                      Refills Remaining: {medication.refillsRemaining}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRefillRequest(medication.medicationID)}
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 flex items-center"
                    disabled={medication.refillsRemaining <= 0}
                  >
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    Request Refill
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No medications found.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
