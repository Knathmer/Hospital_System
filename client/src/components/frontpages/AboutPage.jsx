import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5efe7]">
      <header className="bg-[#f5efe7] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/placeholder.svg?height=40&width=40" alt="UMA Cares logo" className="w-10 h-10" />
            <h1 className="text-2xl font-semibold text-[#4a5d23]">UMA Cares</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-[#8b4513] hover:text-[#4a5d23]">Home</Link>
            <Link to="/about" className="text-[#8b4513] hover:text-[#4a5d23] font-bold">About</Link>
            <Link to="/appointments" className="text-[#8b4513] hover:text-[#4a5d23]">Appointments</Link>
            <Link to="/doctors" className="text-[#8b4513] hover:text-[#4a5d23]">Doctors</Link>
          </nav>
          <Link
            to="/login"
            className="bg-[#cd7f32] text-white px-4 py-2 rounded-md hover:bg-[#b36b27] transition duration-300"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#8b4513] mb-8 text-center">About UMA Cares</h1>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-[#5c4033] text-lg">
              At UMA Cares, we're more than just a hospital system – we're a passionate community dedicated to your health and well-being. Our mission is to provide exceptional, personalized care that goes beyond treating symptoms to nurture your overall wellness.
            </p>
            <p className="text-[#5c4033] text-lg">
              Founded on the principle that every individual deserves compassionate, high-quality healthcare, we've assembled a team of world-class medical professionals who share our vision. From routine check-ups to complex procedures, we're here to support you at every step of your health journey.
            </p>
            <p className="text-[#5c4033] text-lg">
              What sets us apart is our unwavering commitment to innovation, coupled with a deep-rooted sense of empathy. We continuously invest in cutting-edge technology and research, ensuring that you receive the most advanced care possible. But we never lose sight of the human touch that makes healthcare truly healing.
            </p>
          </div>
          <div className="flex justify-center">
            <img src="/placeholder.svg?height=400&width=400" alt="UMA Cares Team" className="rounded-lg shadow-xl" />
          </div>
        </div>

        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-[#4a5d23] mb-6">Our Core Values</h2>
          <ul className="list-disc list-inside space-y-4 text-[#5c4033]">
            <li><span className="font-semibold">Compassion:</span> We treat every patient with kindness, understanding, and respect.</li>
            <li><span className="font-semibold">Excellence:</span> We strive for the highest standards in medical care and patient experience.</li>
            <li><span className="font-semibold">Innovation:</span> We embrace new technologies and methodologies to improve health outcomes.</li>
            <li><span className="font-semibold">Integrity:</span> We uphold the highest ethical standards in all our practices.</li>
            <li><span className="font-semibold">Community:</span> We're committed to the well-being of the communities we serve.</li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-semibold text-[#8b4513] mb-6">Join Us on Your Health Journey</h2>
          <p className="text-[#5c4033] text-lg mb-8">
            Experience the UMA Cares difference – where your health is our passion, and your well-being is our mission.
          </p>
          <Link
            to="/appointments"
            className="inline-block bg-[#4a5d23] text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-[#3a4a1c] transition duration-300"
          >
            Book an Appointment Today
          </Link>
        </div>
      </main>

      <footer className="bg-[#4a5d23] text-white py-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 UMA Cares. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;