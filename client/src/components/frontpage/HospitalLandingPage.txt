import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from 'lucide-react';

const HospitalLandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f5efe7] flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="../src/assets/doctor.svg" alt="UMA Cares logo" className="w-10 h-10" />
          <h1 className="text-2xl font-semibold text-[#4a5d23]">UMA Cares</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-[#8b4513] hover:text-[#4a5d23]">Home</Link>
          <Link to="/about" className="text-[#8b4513] hover:text-[#f1f3ec]">About</Link>
          <Link to="/appointments" className="text-[#8b4513] hover:text-[#4a5d23]">Appointments</Link>
          <Link to="/doctors" className="text-[#8b4513] hover:text-[#4a5d23]">Doctors</Link>
        </nav>
        <Link
          to="/login"
          className="bg-[#cd7f32] text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-[#b36b27]"
        >
          <UserIcon className="w-5 h-5" />
          <span>Log In</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-xl text-[#4a5d23]">Universal Medical Assistance</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-[#8b4513]">Care When You Need It Most</h1>
            <p className="text-[#5c4033] max-w-md">
              Find your doctor and make an appointment. Search for the right doctor based on your needs and easily book
              an appointment online. Get personalized care with trusted medical professionals at your convenience.
            </p>
            <Link
              to="/book"
              className="inline-block bg-[#4a5d23] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-[#3a4a1c]"
            >
              Book Now
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="/path/to/your/doctor-patient-image.png"
              alt="Doctor with patient"
              className="w-full h-auto max-w-md mx-auto"
            />
          </div>
        </div>
      </main>

      <footer className="bg-[#4a5d23] text-white py-4 text-center">
        <p>&copy; 2024 UMA Cares. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HospitalLandingPage;