import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    emergencyPhoneNumber: '',
    emergencyEmail: '',
    addrStreet: '',
    addrZip: '',
    addrCity: '',
    addrState: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => { //e is the event object
    const { name, value } = e.target; //Breaks down the element where changes took place into name and value (Destructuring input)
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  /*
  The above function takes an event that has a value and associated name
  Then uses the predefined useState setter fuction
  ...prevState - ... is a spread operator which takes all key-value pairs from the prior formData useState
  [name]: value - This does essentially a dictionary search and changes the associated value of the key 'name'
  */

  const handleSubmit = async (e) => { //This handles the whole form submission
    e.preventDefault(); //Prevents the default form submission func from calling
    setError(''); //Clears the error object

    if (formData.password !== formData.confirmPassword) { //Handles the case where the confirm password does not match the written password
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', formData);

      if (response.data && response.data.token) { //Explain this section up to the else statement
        if(response.status = 200){
            console.log("Registration Succesful!");
            navigate('/login')
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', error); //Remove later, for debugging purposes
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5efe7]">
      <header className="bg-[#f5efe7] p-4 shadow-md">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <img src="../src/assets/doctor.svg" alt="UMA Cares logo" className="w-10 h-10" />
            <h1 className="text-2xl font-semibold text-[#4a5d23]">UMA Cares</h1>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-[#8b4513] mb-6 text-center">Join UMA Cares</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#5c4033]">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#5c4033]">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-[#5c4033]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-[#5c4033]">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-[#5c4033]">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="999.99"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-[#5c4033]">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="999.99"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#5c4033]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  maxLength="15"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#5c4033]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#5c4033]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5c4033]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="emergencyPhoneNumber" className="block text-sm font-medium text-[#5c4033]">
                  Emergency Phone Number
                </label>
                <input
                  type="tel"
                  id="emergencyPhoneNumber"
                  name="emergencyPhoneNumber"
                  value={formData.emergencyPhoneNumber}
                  onChange={handleChange}
                  required
                  maxLength="15"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
              <div>
                <label htmlFor="emergencyEmail" className="block text-sm font-medium text-[#5c4033]">
                  Emergency Email
                </label>
                <input
                  type="email"
                  id="emergencyEmail"
                  name="emergencyEmail"
                  value={formData.emergencyEmail}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#8b4513] mb-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="addrStreet" className="block text-sm font-medium text-[#5c4033]">
                    Street
                  </label>
                  <input
                    type="text"
                    id="addrStreet"
                    name="addrStreet"
                    value={formData.addrStreet}
                    onChange={handleChange}
                    required
                    maxLength="100"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                  />
                </div>
                <div>
                  <label htmlFor="addrZip" className="block text-sm font-medium text-[#5c4033]">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="addrZip"
                    name="addrZip"
                    value={formData.addrZip}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                  />
                </div>
                <div>
                  <label htmlFor="addrCity" className="block text-sm font-medium text-[#5c4033]">
                    City
                  </label>
                  <input
                    type="text"
                    id="addrCity"
                    name="addrCity"
                    value={formData.addrCity}
                    onChange={handleChange}
                    required
                    maxLength="50"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                  />
                </div>
                <div>
                  <label htmlFor="addrState" className="block text-sm font-medium text-[#5c4033]">
                    State
                  </label>
                  <input
                    type="text"
                    id="addrState"
                    name="addrState"
                    value={formData.addrState}
                    onChange={handleChange}
                    required
                    maxLength="2"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
                  />
                </div>
              </div>
            
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-[#4a5d23] text-white py-2 px-4 rounded-md hover:bg-[#3a4a1c] transition duration-300"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[#5c4033]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#4a5d23] hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#4a5d23] text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 UMA Cares. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationPage;