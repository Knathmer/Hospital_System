import React from 'react';

const DoctorDetailsModal = ({ doctor, onClose }) => {
  if (!doctor) {
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

  const formatAddress = (doctor) => {
    const addrStreet = doctor.addrStreet || doctor.addrstreet;
    const addrZip = doctor.addrZip || doctor.addrzip;
    const addrCity = doctor.addrCity || doctor.addrcity;
    const addrState = doctor.addrState || doctor.addrstate;

    if (addrStreet || addrZip || addrCity || addrState) {
      return `${addrStreet || ''}, ${addrCity || ''}, ${addrState || ''} ${addrZip || ''}`;
    }
    return 'N/A';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          {doctor.firstName || doctor.firstname} {doctor.lastName || doctor.lastname}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Gender:</strong> {doctor.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong>{' '}
              {doctor.dateOfBirth || doctor.dateofbirth
                ? new Date(doctor.dateOfBirth || doctor.dateofbirth).toLocaleDateString()
                : 'N/A'}
            </p>
            <p>
              <strong>Age:</strong> {calculateAge(doctor.dateOfBirth || doctor.dateofbirth)}
            </p>
            <p>
              <strong>Work Phone:</strong> {doctor.workPhoneNumber || doctor.workphonenumber}
            </p>
            <p>
              <strong>Work Email:</strong> {doctor.workEmail || doctor.workemail}
            </p>
            <p>
              <strong>Specialty:</strong> {doctor.specialtyName || doctor.specialtyname || 'N/A'}
            </p>
            <p>
              <strong>Office:</strong> {doctor.officeName || doctor.officename || 'N/A'}
            </p>
            <p>
              <strong>Active:</strong>{' '}
              {doctor.Inactive === 0 || doctor.inactive === 0 ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p>
              <strong>Personal Phone:</strong>{' '}
              {doctor.personalPhoneNumber || doctor.personalphonenumber || 'N/A'}
            </p>
            <p>
              <strong>Personal Email:</strong> {doctor.personalEmail || doctor.personalemail || 'N/A'}
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

export default DoctorDetailsModal;
