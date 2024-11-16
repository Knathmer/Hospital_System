import express from 'express';
import { registerDoctor } from "../../controllers/authController.js"
import {getAppointmentStatistics,
        getDoctorWorkload
        } from '../../controllers/admin/appointmentAnalytics.js';

const router = express.Router();

router.post('/register', registerDoctor);
router.get('/appointmentAnalytics/appointmentStatistics', getAppointmentStatistics);
router.get('/appointmentAnalytics/doctorWorkload', getDoctorWorkload);


export default router;
