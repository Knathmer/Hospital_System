import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientsTable from './PatientsTable.jsx';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, includeInactive]);

  const fetchPatients = async () => {
    try {
      const params = {};
      if (searchTerm) {
        params.searchTerm = searchTerm;
      }
      params.includeInactive = includeInactive;

      const response = await axios.get('http://localhost:3000/auth/admin/patientManagement', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log('Patients data:', response.data.patients);
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>

      {/* Search and Filter */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search patients by name, email, or phone"
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
          Include Inactive Patients
        </label>
      </div>

      {/* Patients Table */}
      <PatientsTable patients={patients} fetchPatients={fetchPatients} token={token} />
    </div>
  );
};

export default PatientManagement;
