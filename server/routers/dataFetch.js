import express from 'express';
import { getOfficeLocations } from '../controllers/officeController.js';
import { welcomeUserName } from '../controllers/patient/patientController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/getOfficeLocations', getOfficeLocations);
router.get('/get-patient-name', verifyToken, welcomeUserName);

export default router;