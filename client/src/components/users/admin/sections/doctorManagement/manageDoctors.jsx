import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorsTable from './DoctorsTable.jsx';
import DoctorForm from './DoctorForm.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null); // For editing

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/auth/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data.doctors);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors.');
      setLoading(false);
      toast.error('Failed to fetch doctors.');
    }
  };

  const handleAddDoctor = () => {
    setCurrentDoctor(null);
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setCurrentDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = async (doctorID) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await axios.delete(`http://localhost:3000/auth/admin/doctors/${doctorID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(doctors.filter(doc => doc.doctorID !== doctorID));
      toast.success('Doctor deleted successfully.');
    } catch (err) {
      console.error('Error deleting doctor:', err);
      toast.error('Failed to delete doctor.');
    }
  };

  const handleFormSubmit = async (doctorData) => {
    if (currentDoctor) {
      // Update existing doctor
      try {
        const res = await axios.put(`http://localhost:3000/auth/admin/doctors/${currentDoctor.doctorID}`, doctorData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(doctors.map(doc => doc.doctorID === currentDoctor.doctorID ? res.data.doctor : doc));
        setIsModalOpen(false);
        toast.success('Doctor updated successfully.');
      } catch (err) {
        console.error('Error updating doctor:', err);
        toast.error('Failed to update doctor.');
      }
    } else {
      // Add new doctor
      try {
        const res = await axios.post('http://localhost:3000/auth/admin/doctors', doctorData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors([...doctors, res.data.doctor]);
        setIsModalOpen(false);
        toast.success('Doctor added successfully.');
      } catch (err) {
        console.error('Error adding doctor:', err);
        toast.error('Failed to add doctor.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 p-6">
      {/* Toast Container for notifications */}
      <ToastContainer />

      <h1 className="text-3xl font-bold text-center mb-6">Manage Doctors</h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAddDoctor}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Add Doctor
        </button>
      </div>

      {loading ? (
        <Skeleton count={10} height={40} />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <DoctorsTable
          doctors={doctors}
          onEdit={handleEditDoctor}
          onDelete={handleDeleteDoctor}
        />
      )}

      {/* Modal for Add/Edit Doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 overflow-auto max-h-screen">
            <DoctorForm
              doctor={currentDoctor}
              onSubmit={handleFormSubmit}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
