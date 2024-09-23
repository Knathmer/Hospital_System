import React from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom'; // UseNavigate for navigation

const HospitalLandingPage = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/path/to/logo.png" alt="UMA Cares" /> {/* Add logo source */}
          <h1>UMA Cares</h1>
        </div>
        <nav className="navigation">
          {/* Replacing <Link> with <button> for navigation */}
          <button className="nav-link" onClick={() => navigate('/')}>Home</button>
          <button className="nav-link" onClick={() => navigate('/about')}>About</button>
          <button className="nav-link" onClick={() => navigate('/appointments')}>Appointments</button>
          <button className="nav-link" onClick={() => navigate('/doctors')}>Doctors</button>
        </nav>
        {/* Use navigate to programmatically go to the login page */}
        <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
      </header>

      {/* Main Section */}
      <main className="main-section">
        <div className="content">
          <h2>Universal Medical Assistance</h2>
          <h1>Care When You Need It Most</h1>
          <p>
            Find your doctor and make an appointment. Search for the right doctor based on 
            your needs and easily book an appointment online. Get personalized care with 
            trusted medical professionals at your convenience.
          </p>
          {/* Programmatic navigation for the Book Now button */}
          <button className="book-btn" onClick={() => navigate('/book')}>Book Now</button>
        </div>
        <div className="image">
          <img src="/path/to/doctor-patient.png" alt="Doctor with Patient" /> {/* Add image source */}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 UMA Cares. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HospitalLandingPage;
