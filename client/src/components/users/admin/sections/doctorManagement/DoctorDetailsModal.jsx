// client/src/components/users/admin/sections/doctorManagement/DoctorDetailsModal.jsx

import React from 'react';

const DoctorDetailsModal = ({ doctor, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          {doctor.firstName} {doctor.lastName}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Gender:</strong> {doctor.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong> {new Date(doctor.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Age:</strong> {calculateAge(doctor.dateOfBirth)}
            </p>
            <p>
              <strong>Work Phone:</strong> {doctor.workPhoneNumber}
            </p>
            <p>
              <strong>Work Email:</strong> {doctor.workEmail}
            </p>
            <p>
              <strong>Specialty:</strong> {doctor.specialtyName}
            </p>
            <p>
              <strong>Office:</strong> {doctor.officeName}
            </p>
            <p>
              <strong>Active:</strong> {doctor.Inactive ? 'No' : 'Yes'}
            </p>
          </div>
          <div>
            <p>
              <strong>Personal Phone:</strong> {doctor.personalPhoneNumber || 'N/A'}
            </p>
            <p>
              <strong>Personal Email:</strong> {doctor.personalEmail || 'N/A'}
            </p>
            <p>
              <strong>Address:</strong> {formatAddress(doctor)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const formatAddress = (doctor) => {
  if (
    doctor.addrStreet ||
    doctor.addrzip ||
    doctor.addrcity ||
    doctor.addrstate
  ) {
    return `${doctor.addrStreet || ''}, ${doctor.addrcity || ''}, ${doctor.addrstate || ''} ${doctor.addrzip || ''}`;
  }
  return 'N/A';
};

export default DoctorDetailsModal;
