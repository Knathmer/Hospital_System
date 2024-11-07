import React, { useState, useEffect } from "react";
import axios from "axios";
import MedicationCard from "../../components/patientComponents/MedicationCard.jsx";
import NoMedicationFound from "../../components/patientComponents/NoMedicationFound.jsx";
import NavbarPatient from "../../components/users/patient/sections/header/NavbarPatient.jsx";
import Footer from "../../components/ui/Footer.jsx";
import { Link } from "react-router-dom";

export default function PrescriptionPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigningPharmacyPrescriptionID, setAssigningPharmacyPrescriptionID] =
    useState(null);
  const [patientPharmacies, setPatientPharmacies] = useState([]);
  const [selectedPharmacyID, setSelectedPharmacyID] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem("token");

      // If no token is found, it means that the user is not authenticated.
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

  const fetchPatientPharmacies = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/auth/patient/medications/manage-pharmacies",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatientPharmacies(response.data.patientPharmacyInformation);
    } catch (error) {
      console.error("Error fetching patient pharmacies: ", error);
      setErrorMessage("Error fetching your pharmacies.");
    }
  };

  const handleAssignPharmacyClick = (prescriptionID) => {
    setAssigningPharmacyPrescriptionID(prescriptionID);
    setErrorMessage("");
    fetchPatientPharmacies();
  };

  const handleAssignPharmacySubmit = async (event) => {
    event.preventDefault();

    if (!selectedPharmacyID) {
      setErrorMessage("Please select a pharmacy.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/auth/patient/medications/${assigningPharmacyPrescriptionID}/pharmacy`,
        { pharmacyID: selectedPharmacyID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchMedications();

      setAssigningPharmacyPrescriptionID(null);
      setSelectedPharmacyID(null);
    } catch (error) {
      console.error("Error assigning pharmacy: ", error);
      setErrorMessage("Error assigning pharmacy. Please try again.");
    }
  };

  useEffect(() => {
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
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient linkTo={"/patient/dashboard"} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
              Medications
            </h1>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl mb-4 text-black">
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
              reconciled by your WomenWell health care provider. It is common
              that this clinical review will take place at your next scheduled
              appointment.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Need to update your list of pharmacies?{" "}
              <Link
                to="manage-pharmacies"
                className="text-pink-600 hover:underline"
              >
                Go to Manage My Pharmacies.
              </Link>
            </p>
            {errorMessage && (
              <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                {errorMessage}
              </div>
            )}
            {medications && medications.length > 0 && (
              <Link
                to="refill-medications"
                className="inline-flex h-9 items-center justify-center rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-700 disabled:pointer-events-none disabled:opacity-50"
              >
                Request refills
              </Link>
            )}
            {medications && medications.length > 0 ? (
              medications.map((med, index) => (
                <div key={index}>
                  <MedicationCard
                    key={index}
                    refillCard={false}
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
                    pharmacyDetails={{
                      pharmacyName: med.pharmacyName || "NULL",
                      pharmacyAddress: med.address || "",
                      pharmacyCity: med.city || "",
                      pharmacyState: med.state || "",
                      pharmacyZip: med.zipCode || "",
                      pharmacyPhoneNum: med.phoneNumber
                        ? med.phoneNumber.slice(0, 3) +
                          "-" +
                          med.phoneNumber.slice(3, 6) +
                          "-" +
                          med.phoneNumber.slice(6)
                        : "",
                    }}
                    onAssignPharmacy={() =>
                      handleAssignPharmacyClick(med.prescriptionID)
                    }
                  />

                  {/* Conditionally render pharmacy assignment form */}
                  {assigningPharmacyPrescriptionID === med.prescriptionID && (
                    <div className="bg-gray-100 p-4 rounded-md mt-2">
                      <h3 className="text-lg font-semibold mb-2">
                        Assign a Pharmacy
                      </h3>
                      {patientPharmacies.length > 0 ? (
                        <form onSubmit={handleAssignPharmacySubmit}>
                          <select
                            className="w-full p-2 border rounded mb-2"
                            value={selectedPharmacyID || ""}
                            onChange={(e) =>
                              setSelectedPharmacyID(e.target.value)
                            }
                          >
                            <option value="">Select a pharmacy</option>
                            {patientPharmacies.map((pharmacy) => (
                              <option
                                key={pharmacy.pharmacyID}
                                value={pharmacy.pharmacyID}
                              >
                                {pharmacy.pharmacyName}, {pharmacy.city},{" "}
                                {pharmacy.state}
                              </option>
                            ))}
                          </select>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-200 rounded"
                              onClick={() => {
                                setAssigningPharmacyPrescriptionID(null);
                                setSelectedPharmacyID(null);
                                setErrorMessage("");
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-pink-600 text-white rounded"
                            >
                              Assign Pharmacy
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p>
                          You have no pharmacies. Please add one first.
                          <Link
                            to="manage-pharmacies"
                            className="text-pink-600 hover:underline ml-1"
                          >
                            Manage Pharmacies
                          </Link>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <NoMedicationFound />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
