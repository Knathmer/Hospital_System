// client/src/components/users/admin/sections/DoctorForm.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorForm = ({ token, doctor, onClose, onSubmit }) => {
  const isEditing = Boolean(doctor);

  const [firstName, setFirstName] = useState(doctor?.firstName || "");
  const [lastName, setLastName] = useState(doctor?.lastName || "");
  const [gender, setGender] = useState(doctor?.gender || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    doctor ? doctor.dateOfBirth.split("T")[0] : ""
  );
  const [workPhoneNumber, setWorkPhoneNumber] = useState(doctor?.workPhoneNumber || "");
  const [workEmail, setWorkEmail] = useState(doctor?.workEmail || "");
  const [password, setPassword] = useState("");
  const [personalPhoneNumber, setPersonalPhoneNumber] = useState(
    doctor?.personalPhoneNumber || ""
  );
  const [personalEmail, setPersonalEmail] = useState(doctor?.personalEmail || "");
  const [specialtyID, setSpecialtyID] = useState(doctor?.specialtyID || "");
  const [specialties, setSpecialties] = useState([]);
  const [inactive, setInactive] = useState(doctor?.Inactive || false);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth/admin/specialties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpecialties(res.data.specialties);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorData = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      workPhoneNumber,
      workEmail,
      personalPhoneNumber,
      personalEmail,
      specialtyID,
      Inactive: inactive,
    };

    if (!isEditing) {
      doctorData.password = password;
    }

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:3000/auth/admin/doctors/${doctor.doctorID}`,
          doctorData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:3000/auth/admin/doctors", doctorData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting doctor data:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Doctor" : "Add Doctor"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border rounded w-full p-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            {/* Work Phone Number */}
            <div>
              <label className="block mb-1">Work Phone Number</label>
              <input
                type="text"
                value={workPhoneNumber}
                onChange={(e) => setWorkPhoneNumber(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            {/* Work Email */}
            <div>
              <label className="block mb-1">Work Email</label>
              <input
                type="email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            {/* Password (only for adding) */}
            {!isEditing && (
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border rounded w-full p-2"
                  required
                />
              </div>
            )}
            {/* Personal Phone Number */}
            <div>
              <label className="block mb-1">Personal Phone Number</label>
              <input
                type="text"
                value={personalPhoneNumber}
                onChange={(e) => setPersonalPhoneNumber(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            {/* Personal Email */}
            <div>
              <label className="block mb-1">Personal Email</label>
              <input
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            {/* Specialty */}
            <div>
              <label className="block mb-1">Specialty</label>
              <select
                value={specialtyID}
                onChange={(e) => setSpecialtyID(e.target.value)}
                className="border rounded w-full p-2"
              >
                <option value="">Select Specialty</option>
                {specialties.map((spec) => (
                  <option key={spec.specialtyID} value={spec.specialtyID}>
                    {spec.specialtyName}
                  </option>
                ))}
              </select>
            </div>
            {/* Inactive */}
            {isEditing && (
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={inactive}
                  onChange={(e) => setInactive(e.target.checked)}
                  className="mr-2"
                />
                <label>Inactive</label>
              </div>
            )}
          </div>
          {/* Buttons */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;
