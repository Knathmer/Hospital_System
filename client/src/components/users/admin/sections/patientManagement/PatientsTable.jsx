import React, { useState } from 'react';
import PatientDetailsModal from './PatientDetailsModal.jsx';
import axios from 'axios';

const PatientsTable = ({ patients, fetchPatients, token }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleMoreClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setShowModal(false);
  };

  const handleInactivatePatient = async (patientID) => {
    const confirmInactivate = window.confirm('Are you sure you want to inactivate this patient?');
    if (confirmInactivate) {
      try {
        await axios.put(
          `http://localhost:3000/auth/admin/patients/${patientID}/inactivate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPatients();
      } catch (error) {
        console.error('Error inactivating patient:', error);
      }
    }
  };

  const handleReactivatePatient = async (patientID) => {
    const confirmReactivate = window.confirm('Are you sure you want to reactivate this patient?');
    if (confirmReactivate) {
      try {
        await axios.put(
          `http://localhost:3000/auth/admin/patients/${patientID}/reactivate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPatients();
      } catch (error) {
        console.error('Error reactivating patient:', error);
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
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Gender</th>
            <th className="py-2 px-4">Date of Birth</th>
            <th className="py-2 px-4">Age</th>
            <th className="py-2 px-4">Phone</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Active</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.patientID} className="text-center">
              <td className="py-2 px-4">
                {patient.firstName} {patient.lastName}
              </td>
              <td className="py-2 px-4">{patient.gender}</td>
              <td className="py-2 px-4">
                {patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="py-2 px-4">{calculateAge(patient.dateOfBirth)}</td>
              <td className="py-2 px-4">{patient.phoneNumber}</td>
              <td className="py-2 px-4">{patient.email}</td>
              <td className="py-2 px-4">{patient.Inactive === 0 ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleMoreClick(patient)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  More
                </button>
                {patient.Inactive === 0 ? (
                  <button
                    onClick={() => handleInactivatePatient(patient.patientID)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Inactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivatePatient(patient.patientID)}
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
      {showModal && selectedPatient && (
        <PatientDetailsModal patient={selectedPatient} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default PatientsTable;
