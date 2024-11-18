import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const AppointmentsTable = ({ appointments }) => {
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'appointmentDateTime',
    direction: 'descending',
  });

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorted appointments
  const getSortedAppointments = () => {
    const sortedAppointments = [...appointments];
    sortedAppointments.sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortConfig.key) {
        case 'appointmentDateTime':
          aValue = new Date(a.appointmentDateTime).getTime();
          bValue = new Date(b.appointmentDateTime).getTime();
          break;
        case 'patientName':
          aValue = `${a.patientFirstName} ${a.patientLastName}`.toLowerCase();
          bValue = `${b.patientFirstName} ${b.patientLastName}`.toLowerCase();
          break;
        case 'doctorName':
          aValue = `${a.doctorFirstName} ${a.doctorLastName}`.toLowerCase();
          bValue = `${b.doctorFirstName} ${b.doctorLastName}`.toLowerCase();
          break;
        default:
          aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
          bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
          break;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortedAppointments;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <div className="overflow-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {[
                { label: 'Date & Time', key: 'appointmentDateTime' },
                { label: 'Patient', key: 'patientName' },
                { label: 'Doctor', key: 'doctorName' },
                { label: 'Office', key: 'officeName' },
                { label: 'Status', key: 'status' },
                { label: 'Visit Type', key: 'visitType' },
                { label: 'Specialty', key: 'specialtyName' },
                { label: 'Service', key: 'serviceName' },
              ].map((column) => (
                <th
                  key={column.key}
                  className="py-2 px-4 cursor-pointer select-none"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center justify-center">
                    {column.label}
                    {sortConfig.key === column.key ? (
                      sortConfig.direction === 'ascending' ? (
                        <FaSortUp className="ml-1" />
                      ) : (
                        <FaSortDown className="ml-1" />
                      )
                    ) : (
                      <FaSort className="ml-1 opacity-50" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getSortedAppointments().map((appointment) => (
              <tr key={appointment.appointmentID} className="text-center">
                <td className="py-2 px-4">
                  {new Date(appointment.appointmentDateTime).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  {appointment.patientFirstName} {appointment.patientLastName}
                </td>
                <td className="py-2 px-4">
                  {appointment.doctorFirstName} {appointment.doctorLastName}
                </td>
                <td className="py-2 px-4">{appointment.officeName}</td>
                <td className="py-2 px-4">{appointment.status}</td>
                <td className="py-2 px-4">{appointment.visitType}</td>
                <td className="py-2 px-4">{appointment.specialtyName}</td>
                <td className="py-2 px-4">{appointment.serviceName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
