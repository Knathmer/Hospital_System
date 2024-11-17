// client/src/components/users/admin/sections/doctorManagement/DoctorsTable.jsx

import React, { useState } from 'react';
import DoctorDetailsModal from './DoctorDetailsModal.jsx';
import axios from 'axios';

const DoctorsTable = ({ doctors, fetchDoctors, token }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleMoreClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setShowModal(false);
  };

  const handleInactivateDoctor = async (doctorID) => {
    const confirm = window.confirm('Are you sure you want to inactivate this doctor?');
    if (confirm) {
      try {
        await axios.put(
          `http://localhost:3000/auth/admin/doctors/${doctorID}/inactivate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchDoctors();
      } catch (error) {
        console.error('Error inactivating doctor:', error);
      }
    }
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Gender</th>
            <th className="py-2 px-4">Date of Birth</th>
            <th className="py-2 px-4">Age</th>
            <th className="py-2 px-4">Work Phone</th>
            <th className="py-2 px-4">Work Email</th>
            <th className="py-2 px-4">Specialty</th>
            <th className="py-2 px-4">Office</th>
            <th className="py-2 px-4">Active</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.doctorID} className="text-center">
              <td className="py-2 px-4">
                {doctor.firstName} {doctor.lastName}
              </td>
              <td className="py-2 px-4">{doctor.gender}</td>
              <td className="py-2 px-4">{new Date(doctor.dateOfBirth).toLocaleDateString()}</td>
              <td className="py-2 px-4">{calculateAge(doctor.dateOfBirth)}</td>
              <td className="py-2 px-4">{doctor.workPhoneNumber}</td>
              <td className="py-2 px-4">{doctor.workEmail}</td>
              <td className="py-2 px-4">{doctor.specialtyName}</td>
              <td className="py-2 px-4">{doctor.officeName}</td>
              <td className="py-2 px-4">{doctor.Inactive ? 'No' : 'Yes'}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleMoreClick(doctor)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  More
                </button>
                {!doctor.Inactive && (
                  <button
                    onClick={() => handleInactivateDoctor(doctor.doctorID)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Inactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedDoctor && (
        <DoctorDetailsModal doctor={selectedDoctor} onClose={handleCloseModal} />
      )}
    </div>
  );
};

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default DoctorsTable;
