import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getOfficeLocations } from '../controllers/officeController.js';
import { welcomePatientName } from '../controllers/patient/patientNameInSidebarController.js';
import { welcomeDocName } from '../controllers/doctor/docNameInSidebar.js';
import { welcomeAdminName } from '../controllers/adminNameInSidebar.js';
import { getAppointmentsDashboard, getBillDashboard, getMedsResultsDashboard } from '../controllers/patient/patientDashboard.js';
import { totalAdmins, totalAppointments, totalDoctors, totalPatients } from '../controllers/adminDashboard.js';

const router = express.Router();

router.get('/getOfficeLocations', getOfficeLocations);
router.get('/get-patient-name', verifyToken, welcomePatientName);
router.get('/get-doc-name', verifyToken, welcomeDocName);
router.get('/get-admin-name', verifyToken, welcomeAdminName);
router.get('/get-appointment-dashboard', verifyToken, getAppointmentsDashboard);
router.get('/get-meds-dashboard', verifyToken, getMedsResultsDashboard);
router.get('/get-billing-dashboard', verifyToken, getBillDashboard);
router.get('/get-total-doctors', verifyToken, totalDoctors);
router.get('/get-total-patients', verifyToken, totalPatients);
router.get('/get-total-admin', verifyToken, totalAdmins );
router.get('/get-total-appointments', verifyToken, totalAppointments);

export default router;