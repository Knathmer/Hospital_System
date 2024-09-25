import { Routes, Route} from 'react-router-dom';

import axios from "axios";

import HospitalLandingPage from './frontpage/HospitalLandingPage.jsx';
import AboutPage from './frontpage/AboutPage.jsx';
import AppointmentsPage from './frontpage/AppointmentsPage';
import DoctorsPage from './frontpage/DoctorsPage.jsx';
import LoginPage from './frontpage/LoginPage.jsx';
import BookPage from './frontpage/BookPage.jsx';
import '../Styles.css'; // This imports tailwind css file.


function App(){

  return (
     <Routes>
        <Route path="/" element={<HospitalLandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<BookPage />} />
    </Routes>
  )
}

export default App
