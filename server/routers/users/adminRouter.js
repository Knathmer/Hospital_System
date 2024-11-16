import express from 'express';
import { registerDoctor } from "../../controllers/authController.js"
import {
        getAppointmentAnalytics,
        getStates,
        getCities,
        getOffices,
        getDoctors,
        getPatients
      } from "../../controllers/admin/appointmentAnalytics.js";

const router = express.Router();

router.post('/register', registerDoctor);
router.get('/appointmentAnalytics', getAppointmentAnalytics);
router.get('/states', getStates);
router.get('/cities', getCities);
router.get('/offices', getOffices);
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);


export default router;
