import express from 'express';
//import { doctorController } from '../../controllers/doctorController.js';
import { getPatientInfo } from '../../controllers/doctor/patientController.js';

const router = express.Router();

router.get('/patient/:patientID', getPatientInfo);

export default router;
