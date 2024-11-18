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
    const confirmInactivate = window.confirm('Are you sure you want to inactivate this doctor?');
    if (confirmInactivate) {
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

  // **New function to handle reactivation**
  const handleReactivateDoctor = async (doctorID) => {
    const confirmReactivate = window.confirm('Are you sure you want to reactivate this doctor?');
    if (confirmReactivate) {
      try {
        await axios.put(
          `http://localhost:3000/auth/admin/doctors/${doctorID}/reactivate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchDoctors();
      } catch (error) {
        console.error('Error reactivating doctor:', error);
      }
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    if (isNaN(dob)) return 'N/A';
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {/* ... Table Headers ... */}
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
              <td className="py-2 px-4">
                {doctor.dateOfBirth
                  ? new Date(doctor.dateOfBirth).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="py-2 px-4">{calculateAge(doctor.dateOfBirth)}</td>
              <td className="py-2 px-4">{doctor.workPhoneNumber}</td>
              <td className="py-2 px-4">{doctor.workEmail}</td>
              <td className="py-2 px-4">{doctor.specialtyName || 'N/A'}</td>
              <td className="py-2 px-4">{doctor.officeName || 'N/A'}</td>
              <td className="py-2 px-4">{doctor.Inactive === 0 ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleMoreClick(doctor)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  More
                </button>
                {doctor.Inactive === 0 ? (
                  <button
                    onClick={() => handleInactivateDoctor(doctor.doctorID)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Inactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivateDoctor(doctor.doctorID)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Reactivate
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

export default DoctorsTable;
