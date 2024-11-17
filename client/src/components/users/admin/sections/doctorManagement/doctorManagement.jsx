// client/src/components/users/admin/sections/doctorManagement/DoctorManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [inactiveFilter, setInactiveFilter] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, [searchQuery, selectedSpecialty, inactiveFilter]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchQuery,
          specialty: selectedSpecialty,
          inactive: inactiveFilter,
        },
      });
      setDoctors(res.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/admin/specialties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpecialties(res.data.specialties);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedDoctors = () => {
    const sortedDoctors = [...doctors];
    sortedDoctors.sort((a, b) => {
      let aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
      let bValue = b[sortConfig.key]?.toString().toLowerCase() || '';

      if (sortConfig.key === 'name') {
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortedDoctors;
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Doctor Management</h1>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doctors by name"
          className="border rounded p-2 w-full md:w-1/3 mb-2 md:mb-0"
        />

        {/* Specialty Filter */}
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="border rounded p-2 w-full md:w-1/4 mb-2 md:mb-0"
        >
          <option value="">All Specialties</option>
          {specialties.map((specialty) => (
            <option key={specialty.specialtyID} value={specialty.specialtyName}>
              {specialty.specialtyName}
            </option>
          ))}
        </select>

        {/* Inactive Filter */}
        <select
          value={inactiveFilter}
          onChange={(e) => setInactiveFilter(e.target.value)}
          className="border rounded p-2 w-full md:w-1/4"
        >
          <option value="">All Statuses</option>
          <option value="0">Active</option>
          <option value="1">Inactive</option>
        </select>
      </div>

      {/* Doctors Table */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {[
                { label: 'Doctor Name', key: 'name' },
                { label: 'Specialty', key: 'specialtyName' },
                { label: 'Work Email', key: 'workEmail' },
                { label: 'Work Phone Number', key: 'workPhoneNumber' },
                { label: 'Office Address', key: 'officeAddress' },
                { label: 'Inactive Status', key: 'Inactive' },
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
            {getSortedDoctors().map((doctor) => (
              <tr key={doctor.doctorID} className="text-center">
                <td className="py-2 px-4">
                  {doctor.firstName} {doctor.lastName}
                </td>
                <td className="py-2 px-4">{doctor.specialtyName}</td>
                <td className="py-2 px-4">{doctor.workEmail}</td>
                <td className="py-2 px-4">{doctor.workPhoneNumber}</td>
                <td className="py-2 px-4">{doctor.officeAddress}</td>
                <td className="py-2 px-4">{doctor.Inactive ? 'Inactive' : 'Active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagement;
