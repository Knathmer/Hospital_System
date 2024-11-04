import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getOfficeLocations } from '../controllers/officeController.js';
import { welcomePatientName } from '../controllers/patient/patientNameInSidebarController.js';
import { welcomeDocName } from '../controllers/doctor/docNameInSidebar.js';

const router = express.Router();

router.get('/getOfficeLocations', getOfficeLocations);
router.get('/get-patient-name', verifyToken, welcomePatientName);
router.get('/get-doc-name', verifyToken, welcomeDocName);

export default router;