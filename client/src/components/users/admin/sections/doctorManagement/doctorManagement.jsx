import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorsTable from './DoctorsTable.jsx';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, includeInactive]);

  const fetchDoctors = async () => {
    try {
      const params = {};
      if (searchTerm) {
        params.searchTerm = searchTerm;
      }
      params.includeInactive = includeInactive;

      const response = await axios.get('http://localhost:3000/auth/admin/doctorManagement', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log('Doctors data:', response.data.doctors);
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Doctor Management</h1>

      {/* Search and Filter */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search doctors by name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-80 mr-4"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="mr-2"
          />
          Include Inactive Doctors
        </label>
      </div>

      {/* Doctors Table */}
      <DoctorsTable doctors={doctors} fetchDoctors={fetchDoctors} token={token} />
    </div>
  );
};

export default DoctorManagement;
