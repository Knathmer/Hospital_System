import express from 'express';
import { getSpecialties, 
    bookAppointment, 
    getDoctorsBySpecialty, 
    getAppointmentsByDoctorAndDate, 
    getDoctorAppointments, 
    updateAppointment} from '../controllers/appointmentController.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Appointment routes
router.get("/specialties", getSpecialties);
router.get('/doctors', getDoctorsBySpecialty);
router.post('/book', verifyToken, bookAppointment);
router.get('/appointments', getAppointmentsByDoctorAndDate);

// New route to get appointments for the logged-in doctor
router.get('/doctorAppointments', verifyToken, getDoctorAppointments);

// Route to update an appointment
router.put('/updateAppointment', verifyToken, updateAppointment);

export default router;
