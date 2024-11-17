import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DoctorsTable = ({ doctors, onEdit, onDelete }) => {
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">First Name</th>
            <th className="py-2 px-4 border-b">Last Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Specialty ID</th>
            <th className="py-2 px-4 border-b">Office ID</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.doctorID} className="text-center hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{doctor.doctorID}</td>
              <td className="py-2 px-4 border-b">{doctor.firstName}</td>
              <td className="py-2 px-4 border-b">{doctor.lastName}</td>
              <td className="py-2 px-4 border-b">{doctor.workEmail}</td>
              <td className="py-2 px-4 border-b">{doctor.specialtyID}</td>
              <td className="py-2 px-4 border-b">{doctor.officeID}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onEdit(doctor)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(doctor.doctorID)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {doctors.length === 0 && (
            <tr>
              <td colSpan="7" className="py-4 px-4">No doctors found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;
