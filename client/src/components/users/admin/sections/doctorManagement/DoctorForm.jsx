import React, { useState, useEffect } from 'react';

const DoctorForm = ({ doctor, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    workPhoneNumber: '',
    workEmail: '',
    password: '',
    personalPhoneNumber: '',
    personalEmail: '',
    officeID: '',
    addressID: '',
    specialtyID: '',
    Inactive: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        gender: doctor.gender || 'Male',
        dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.split('T')[0] : '',
        workPhoneNumber: doctor.workPhoneNumber || '',
        workEmail: doctor.workEmail || '',
        password: '', // For security, do not pre-fill password
        personalPhoneNumber: doctor.personalPhoneNumber || '',
        personalEmail: doctor.personalEmail || '',
        officeID: doctor.officeID || '',
        addressID: doctor.addressID || '',
        specialtyID: doctor.specialtyID || '',
        Inactive: doctor.Inactive || false,
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.workEmail.trim()) newErrors.workEmail = 'Work email is required.';
    // Add more validations as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">{doctor ? 'Edit Doctor' : 'Add Doctor'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block mb-1 font-semibold">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`border rounded p-2 w-full ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-semibold">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`border rounded p-2 w-full ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 font-semibold">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block mb-1 font-semibold">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Work Phone Number */}
        <div>
          <label className="block mb-1 font-semibold">Work Phone Number</label>
          <input
            type="text"
            name="workPhoneNumber"
            value={formData.workPhoneNumber}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Work Email */}
        <div>
          <label className="block mb-1 font-semibold">Work Email</label>
          <input
            type="email"
            name="workEmail"
            value={formData.workEmail}
            onChange={handleChange}
            className={`border rounded p-2 w-full ${errors.workEmail ? 'border-red-500' : ''}`}
          />
          {errors.workEmail && <p className="text-red-500 text-sm">{errors.workEmail}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`border rounded p-2 w-full ${!doctor && !formData.password ? 'border-red-500' : ''}`}
            required={!doctor} // Required only for adding
          />
          {!doctor && !formData.password && <p className="text-red-500 text-sm">Password is required.</p>}
        </div>

        {/* Personal Phone Number */}
        <div>
          <label className="block mb-1 font-semibold">Personal Phone Number</label>
          <input
            type="text"
            name="personalPhoneNumber"
            value={formData.personalPhoneNumber}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Personal Email */}
        <div>
          <label className="block mb-1 font-semibold">Personal Email</label>
          <input
            type="email"
            name="personalEmail"
            value={formData.personalEmail}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Office ID */}
        <div>
          <label className="block mb-1 font-semibold">Office ID</label>
          <input
            type="number"
            name="officeID"
            value={formData.officeID}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Address ID */}
        <div>
          <label className="block mb-1 font-semibold">Address ID</label>
          <input
            type="number"
            name="addressID"
            value={formData.addressID}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Specialty ID */}
        <div>
          <label className="block mb-1 font-semibold">Specialty ID</label>
          <input
            type="number"
            name="specialtyID"
            value={formData.specialtyID}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Inactive */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="Inactive"
            checked={formData.Inactive}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-semibold">Inactive</label>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {doctor ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;
