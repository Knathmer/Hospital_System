import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const LoginPage = () => {
  //Hooks(Event handler) (For dyanmically updating site)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
  
      if (response.data.token) {
        // Store the JWT token and user role in the browser
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role); // Save the user role
  
        // Redirect based on user role
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (response.data.user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (response.data.user.role === 'patient') {
          navigate('/patient/dashboard');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#f5efe7]">
      <header className="bg-[#f5efe7] p-4 shadow-md">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/placeholder.svg?height=40&width=40" alt="UMA Cares logo" className="w-10 h-10" />
            <h1 className="text-2xl font-semibold text-[#4a5d23]">UMA Cares</h1>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#8b4513] mb-6 text-center">Welcome Back</h2>

          {/* Display error message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5c4033]">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // e is the form object, and this just calls the setEmail function from useState
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-[#cd7f32] rounded-md text-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#4a5d23]"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#4a5d23] text-white py-2 px-4 rounded-md hover:bg-[#3a4a1c] transition duration-300"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[#5c4033]">
              First time patient?{' '}
              <Link to="/register" className="text-[#4a5d23] hover:underline">
                Register here
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-[#8b4513] hover:underline text-sm">
              Forgot your password?
            </Link>
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

export default LoginPage;