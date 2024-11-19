import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";

import envConfig from "../../../../envConfig";

const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    specialtyID: "",
    workPhoneNumber: "",
    workEmail: "",
    password: "",
    confirmPassword: "",
    personalPhoneNumber: "",
    personalEmail: "",
    addrStreet: "",
    addrZip: "",
    addrCity: "",
    addrState: "",
    officeID: "",
  });

  const [specialties, setSpecialties] = useState([]);
  const [offices, setOffices] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get(`${envConfig.apiUrl}/auth/admin/specialSpecialties`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Specialties API response:', response.data);
        setSpecialties(response.data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
        setError('Failed to load specialties');
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/getOfficeLocations`
        );
        setOffices(response.data); // Set the offices in state
      } catch (error) {
        console.error("Error fetching office locations:", error);
        setError("Failed to load office locations");
      }
    };
    fetchOffices();
  }, []);

  const navigate = useNavigate(); //Allows navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Grab JWT since we are going to protected routes
      const response = await axios.post(
        `${envConfig.apiUrl}/auth/admin/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use backticks for string interpolation
          },
        }
      );

      if (response.status === 200 && response.data) {
        console.log("Doctor Registration Successful!");
        setSuccessMessage("Doctor registered successfully!");

      // Clear form data
        setFormData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
          specialtyID: "",
          workPhoneNumber: "",
          workEmail: "",
          password: "",
          confirmPassword: "",
          personalPhoneNumber: "",
          personalEmail: "",
          addrStreet: "",
          addrZip: "",
          addrCity: "",
          addrState: "",
          officeID: "",
        });
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-lg shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Register Doctor
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to register a new doctor
            </p>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="specialtyID"
                  className="block text-sm font-medium text-gray-700"
                >
                  Specialty
                </label>
                <select
                  id="specialtyID"
                  name="specialtyID"
                  value={formData.specialtyID}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select Specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.specialtyID} value={specialty.specialtyID}>
                      {specialty.specialtyName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Contact Information */}
              <div>
                <label
                  htmlFor="workPhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Work Phone Number
                </label>
                <input
                  type="tel"
                  id="workPhoneNumber"
                  name="workPhoneNumber"
                  value={formData.workPhoneNumber}
                  onChange={handleChange}
                  required
                  maxLength="15"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="workEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Work Email
                </label>
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="personalPhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Personal Phone Number
                </label>
                <input
                  type="tel"
                  id="personalPhoneNumber"
                  name="personalPhoneNumber"
                  value={formData.personalPhoneNumber}
                  onChange={handleChange}
                  maxLength="15"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="personalEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Personal Email
                </label>
                <input
                  type="email"
                  id="personalEmail"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              {/* Password Fields */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label
                  htmlFor="officeID"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Location
                </label>
                <select
                  id="officeID"
                  name="officeID"
                  value={formData.officeID}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select Office</option>
                  {offices.map((office) => (
                    <option key={office.officeID} value={office.officeID}>
                      {office.officeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Address Fields */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="addrStreet"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street
                  </label>
                  <input
                    type="text"
                    id="addrStreet"
                    name="addrStreet"
                    value={formData.addrStreet}
                    onChange={handleChange}
                    required
                    maxLength="100"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="addrZip"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="addrZip"
                    name="addrZip"
                    value={formData.addrZip}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="addrCity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="addrCity"
                    name="addrCity"
                    value={formData.addrCity}
                    onChange={handleChange}
                    required
                    maxLength="50"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="addrState"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="addrState"
                    name="addrState"
                    value={formData.addrState}
                    onChange={handleChange}
                    required
                    maxLength="2"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Register Doctor
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="py-6 text-center border-t bg-white">
        <p className="text-sm text-gray-500">
          © 2024 WomenWell. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default RegisterDoctor;
