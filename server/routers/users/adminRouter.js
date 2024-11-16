import express from 'express';
import { registerDoctor } from "../../controllers/authController.js"
import {
        getAppointmentAnalytics,
        getStates,
        getCities,
        getOffices,
        getDoctors,
        getPatients,
        getAppointmentStatuses,
        getVisitTypes,
        getSpecialties,
        getServices,
      } from "../../controllers/admin/appointmentAnalytics.js";

const router = express.Router();

router.post('/register', registerDoctor);
router.get('/appointmentAnalytics', getAppointmentAnalytics);
router.get('/states', getStates);
router.get('/cities', getCities);
router.get('/offices', getOffices);
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);
router.get('/statuses', getAppointmentStatuses);
router.get('/visitTypes', getVisitTypes);
router.get('/specialties', getSpecialties);
router.get('/services', getServices);


export default router;
