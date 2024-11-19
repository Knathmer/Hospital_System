import React from 'react';

const PatientDetailsModal = ({ patient, onClose }) => {
  if (!patient) {
    return null;
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    if (isNaN(dob)) return 'N/A';
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatAddress = (patient) => {
    const addrStreet = patient.addrStreet || patient.addrstreet;
    const addrZip = patient.addrZip || patient.addrzip;
    const addrCity = patient.addrCity || patient.addrcity;
    const addrState = patient.addrState || patient.addrstate;

    if (addrStreet || addrZip || addrCity || addrState) {
      return `${addrStreet || ''}, ${addrCity || ''}, ${addrState || ''} ${addrZip || ''}`;
    }
    return 'N/A';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          {patient.firstName} {patient.lastName}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Gender:</strong> {patient.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong>{' '}
              {patient.dateOfBirth
                ? new Date(patient.dateOfBirth).toLocaleDateString()
                : 'N/A'}
            </p>
            <p>
              <strong>Age:</strong> {calculateAge(patient.dateOfBirth)}
            </p>
            <p>
              <strong>Phone Number:</strong> {patient.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {patient.email}
            </p>
            <p>
              <strong>Active:</strong> {patient.Inactive === 0 ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p>
              <strong>Address:</strong> {formatAddress(patient)}
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

export default PatientDetailsModal;
