// client/src/components/users/admin/sections/DoctorManagement.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorForm from "./DoctorForm.jsx";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDeleteDoctor = async (doctorID) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`http://localhost:3000/auth/admin/doctors/${doctorID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDoctors();
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchDoctors();
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Doctor Management</h1>
      <button
        onClick={handleAddDoctor}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Add Doctor
      </button>

      {showForm && (
        <DoctorForm
          token={token}
          doctor={editingDoctor}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      <div className="overflow-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {[
                "First Name",
                "Last Name",
                "Gender",
                "Date of Birth",
                "Work Email",
                "Work Phone",
                "Specialty",
                "Actions",
              ].map((header) => (
                <th key={header} className="py-2 px-4 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.doctorID} className="text-center">
                <td className="py-2 px-4 border-b">{doctor.firstName}</td>
                <td className="py-2 px-4 border-b">{doctor.lastName}</td>
                <td className="py-2 px-4 border-b">{doctor.gender}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(doctor.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">{doctor.workEmail}</td>
                <td className="py-2 px-4 border-b">{doctor.workPhoneNumber}</td>
                <td className="py-2 px-4 border-b">{doctor.specialtyName || "N/A"}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditDoctor(doctor)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor.doctorID)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagement;
