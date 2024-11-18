import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { PlusCircle, ArrowLeft } from "lucide-react";
import NavbarPatient from "../../components/users/patient/sections/header/NavbarPatient.jsx";
import Footer from "../../components/ui/Footer";
import { Link } from "react-router-dom";
import PharmacyCard from "../../components/patientComponents/PharmacyCard.jsx";

import envConfig from "../../envConfig.js";

export default function ManagePharmaciesPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingPharmacy, setIsAddingPharmacy] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({
    pharmacyName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  });
  const [allPharmacies, setAllPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showAddPharmacyForm, setShowAddPharmacyForm] = useState(false);

  const fetchPharmacies = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${envConfig.apiUrl}/auth/patient/medications/manage-pharmacies`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPharmacies(response.data.patientPharmacyInformation);
    } catch (error) {
      console.error("Error fetching pharmacies: ", error);
      if (error.response && error.response.status === 401) {
        setError("Session expired. Please log in again");
      } else {
        setError("Error fetching pharmacies");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPharmacies = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const response = await axios.get(
        `${envConfig.apiUrl}/auth/patient/pharmacies`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllPharmacies(response.data.allPharmacies);
    } catch (error) {
      console.error("Error fetching all pharmacies: ", error);
    }
  };

  const handleRemovePharmacy = async (pharmacyID) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated!");
        return;
      }

      await axios.delete(
        `${envConfig.apiUrl}/auth/patient/pharmacies/${pharmacyID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPharmacies();
    } catch (error) {
      console.error("Error removing pharmacy: ", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Error removing pharmacy");
      }
    }
  };

  useEffect(() => {
    fetchPharmacies();
    fetchAllPharmacies();
  }, []);

  const pharmacyOptions = allPharmacies.map((pharmacy) => ({
    value: pharmacy.pharmacyID,
    label: `${pharmacy.pharmacyName}, ${pharmacy.city}, ${pharmacy.state}`,
    pharmacy,
  }));

  const handleAddPharmacy = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated!");
        return;
      }

      let pharmacyID;

      if (showAddPharmacyForm) {
        // User is adding a new pharmacy
        const { pharmacyName, address, city, state, zipCode, phoneNumber } =
          newPharmacy;

        if (
          pharmacyName.trim() &&
          address.trim() &&
          city.trim() &&
          state.trim() &&
          zipCode.trim() &&
          phoneNumber.trim()
        ) {
          const pharmacyData = {
            pharmacyName: pharmacyName.trim(),
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            zipCode: zipCode.trim(),
            phoneNumber: phoneNumber.trim(),
          };

          // Send POST request to add the new pharmacy
          const response = await axios.post(
            `${envConfig.apiUrl}/auth/patient/pharmacies`,
            pharmacyData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          pharmacyID = response.data.pharmacy.pharmacyID;
        } else {
          setError("Please fill in all fields");
          return;
        }

        // Since the new pharmacy is already associated with the patient,
        // we don't need to make another request to associate it.
      } else if (selectedPharmacy) {
        // User selected an existing pharmacy
        pharmacyID = selectedPharmacy.pharmacyID;

        // Associate the pharmacy with the patient
        await axios.post(
          `${envConfig.apiUrl}/auth/patient/pharmacies/add`,
          { pharmacyID },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        setError("Please select a pharmacy or add a new one");
        return;
      }

      // Fetch updated list of patient's pharmacies
      await fetchPharmacies();

      // Reset form and state
      setNewPharmacy({
        pharmacyName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
      });
      setSelectedPharmacy(null);
      setShowAddPharmacyForm(false);
      setIsAddingPharmacy(false);
      setError("");
    } catch (error) {
      console.error("Error adding pharmacy: ", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Error adding pharmacy");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading pharmacies...</p>
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
              Manage Pharmacies
            </h1>
          </div>
          <div className="mb-4">
            <Link
              to=".."
              className="flex items-center text-pink-600 hover:text-pink-700 mt-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Medications
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl mb-4 text-black">
              Your Pharmacies
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Manage your list of pharmacies below. You can add new pharmacies,
              or remove pharmacies from your list.
            </p>

            {pharmacies && pharmacies.length > 0 ? (
              pharmacies.map((pharmacy) => (
                <PharmacyCard
                  key={pharmacy.pharmacyID}
                  pharmacyID={pharmacy.pharmacyID}
                  pharmacyName={pharmacy.pharmacyName}
                  address={pharmacy.address}
                  city={pharmacy.city}
                  state={pharmacy.state}
                  zipCode={pharmacy.zipCode}
                  phoneNumber={
                    pharmacy.phoneNumber.slice(0, 3) +
                    "-" +
                    pharmacy.phoneNumber.slice(3, 6) +
                    "-" +
                    pharmacy.phoneNumber.slice(6)
                  }
                  onRemove={handleRemovePharmacy}
                />
              ))
            ) : (
              <p>No pharmacies found.</p>
            )}

            {isAddingPharmacy ? (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-pink-600 mb-2">
                  Add Pharmacy
                </h3>
                {error && (
                  <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                    {error}
                  </div>
                )}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search and select a pharmacy
                </label>
                <Select
                  options={pharmacyOptions}
                  onChange={(option) =>
                    setSelectedPharmacy(option ? option.pharmacy : null)
                  }
                  placeholder="Search for a pharmacy..."
                  isClearable
                />
                <p className="mt-2 text-sm text-gray-600">
                  Can't find your pharmacy?{" "}
                  <button
                    onClick={() => {
                      setShowAddPharmacyForm(true);
                      setSelectedPharmacy(null); // Clear selected pharmacy
                    }}
                    className="text-pink-600 hover:underline"
                  >
                    Add a new pharmacy
                  </button>
                </p>

                {showAddPharmacyForm && (
                  <div className="mt-4">
                    {/* Form fields to add a new pharmacy */}
                    <input
                      type="text"
                      placeholder="Pharmacy Name"
                      className="w-full p-2 mb-2 border rounded"
                      value={newPharmacy.pharmacyName}
                      onChange={(e) =>
                        setNewPharmacy({
                          ...newPharmacy,
                          pharmacyName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Pharmacy's Address"
                      className="w-full p-2 mb-2 border rounded"
                      value={newPharmacy.address}
                      onChange={(e) =>
                        setNewPharmacy({
                          ...newPharmacy,
                          address: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full p-2 mb-2 border rounded"
                      value={newPharmacy.city}
                      onChange={(e) =>
                        setNewPharmacy({
                          ...newPharmacy,
                          city: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="w-full p-2 mb-2 border rounded"
                      value={newPharmacy.state}
                      onChange={(e) =>
                        setNewPharmacy({
                          ...newPharmacy,
                          state: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Zip"
                      className="w-full p-2 mb-2 border rounded"
                      value={newPharmacy.zipCode}
                      onChange={(e) =>
                        setNewPharmacy({
                          ...newPharmacy,
                          zipCode: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Pharmacy's Phone Number"
                      className="w-full p-2 mb-2 border rounded"
                      value={newPharmacy.phoneNumber}
                      onChange={(e) =>
                        setNewPharmacy({
                          ...newPharmacy,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    onClick={() => {
                      setIsAddingPharmacy(false);
                      setError("");
                      setNewPharmacy({
                        pharmacyName: "",
                        address: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        phoneNumber: "",
                      });
                      setSelectedPharmacy(null);
                      setShowAddPharmacyForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    onClick={handleAddPharmacy}
                  >
                    Add Pharmacy
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="flex items-center justify-center w-full p-2 mt-4 text-pink-600 bg-white rounded-lg "
                onClick={() => {
                  setIsAddingPharmacy(true);
                  setError("");
                  setSelectedPharmacy(null); // Clear selected pharmacy
                  setShowAddPharmacyForm(false); // Ensure add form is hidden
                }}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Pharmacy
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
