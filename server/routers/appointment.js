import express from 'express';
import { getSpecialties, bookAppointment, getDoctorsBySpecialty, getAppointmentsByDoctorAndDate } from '../controllers/appointmentController.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Appointment routes
router.get("/specialties", getSpecialties);
router.get('/doctors', getDoctorsBySpecialty);
router.post('/book', verifyToken, bookAppointment);
router.get('/appointments', getAppointmentsByDoctorAndDate);

export default router;
