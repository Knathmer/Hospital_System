// src/components/users/patient/ManageDoctors.jsx

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const ManageDoctors = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000/auth/patient';

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const [allRes, assignedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/assigned`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAllDoctors(allRes.data);
        setAssignedDoctors(assignedRes.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to fetch doctors.');
      }
    };

    fetchDoctors();
  }, [API_BASE_URL, token]);

  const hasPrimary = assignedDoctors.some(doc => doc.isPrimary === 1);

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) {
      setError('Please select a doctor to assign.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_BASE_URL}/assign`, {
        doctorID: selectedDoctor.value,
        isPrimary: isPrimary,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh assigned doctors
      const assignedRes = await axios.get(`${API_BASE_URL}/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedDoctors(assignedRes.data);

      // Reset selection
      setSelectedDoctor(null);
      setIsPrimary(false);
    } catch (err) {
      console.error('Error assigning doctor:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to assign doctor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoctor = async (doctorID) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/remove/${doctorID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh assigned doctors
      const assignedRes = await axios.get(`${API_BASE_URL}/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedDoctors(assignedRes.data);
    } catch (err) {
      console.error('Error removing doctor:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to remove doctor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const options = allDoctors.map(doc => ({
    value: doc.doctorID,
    label: `${doc.firstName} ${doc.lastName} (${doc.workEmail})`,
  }));

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <div className="flex items-center justify-center">
          <span className="ml-2 text-2xl font-bold text-gray-900">Manage Your Doctors</span>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Assign a New Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                <Select
                  options={options}
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  placeholder="Choose a doctor..."
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  disabled={hasPrimary}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                />
                <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700">
                  Set as Primary Care Provider
                </label>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAssignDoctor}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:bg-pink-300"
                >
                  {loading ? 'Assigning...' : 'Assign Doctor'}
                </button>
              </div>
            </div>
            {hasPrimary && (
              <p className="mt-2 text-sm text-gray-600">
                You already have a primary care provider. To assign a new primary, please remove the existing one first.
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Assigned Doctors</h2>
            {assignedDoctors.length === 0 ? (
              <p className="text-gray-700">You have not assigned any doctors yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {assignedDoctors.map(doc => (
                  <li key={doc.doctorID} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">{doc.firstName} {doc.lastName}</p>
                      <p className="text-sm text-gray-600">Specialty ID: {doc.specialtyID}</p>
                      <p className="text-sm text-gray-600">Email: {doc.workEmail}</p>
                      <p className="text-sm text-gray-600">Phone: {doc.workPhoneNumber}</p>
                      {doc.isPrimary === 1 && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-white bg-pink-500 rounded-full">
                          Primary Care Provider
                        </span>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => handleRemoveDoctor(doc.doctorID)}
                        disabled={doc.isPrimary === 1}
                        className={`px-3 py-1 text-sm text-white rounded ${
                          doc.isPrimary === 1
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageDoctors;
