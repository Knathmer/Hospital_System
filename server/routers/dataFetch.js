import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getOfficeLocations } from '../controllers/officeController.js';
import { welcomePatientName } from '../controllers/patient/patientNameInSidebarController.js';
import { welcomeDocName } from '../controllers/doctor/docNameInSidebar.js';
import { welcomeAdminName } from '../controllers/admin/adminNameInSidebar.js';
import { getAppointmentsDashboard, getBillDashboard, getMedsResultsDashboard } from '../controllers/patient/patientDashboard.js';
import { getUpcomingAppointmentAdmin, listOfDocAdmin, totalAdmins, totalAppointments, totalDoctors, totalPatients } from '../controllers/admin/adminDashboard.js';
import { getPatientServices } from "../controllers/admin/patientReport.js";

const router = express.Router();

router.get('/getOfficeLocations', getOfficeLocations);
router.get('/get-patient-name', verifyToken, welcomePatientName);
router.get('/get-doc-name', verifyToken, welcomeDocName);
router.get('/get-admin-name', verifyToken, welcomeAdminName);
router.get('/get-appointment-dashboard', verifyToken, getAppointmentsDashboard);
router.get('/get-meds-dashboard', verifyToken, getMedsResultsDashboard);
router.get('/get-billing-dashboard', verifyToken, getBillDashboard);

// Admin Dashboard
router.get('/get-total-doctors', verifyToken, totalDoctors);
router.get('/get-total-patients', verifyToken, totalPatients);
router.get('/get-total-admin', verifyToken, totalAdmins );
router.get('/get-total-appointments', verifyToken, totalAppointments);
router.get('/get-upcoming-appointments', verifyToken, getUpcomingAppointmentAdmin);
router.get('/get-doctors-list', verifyToken, listOfDocAdmin);

// Patient Reports
router.get("/get-patient-services", verifyToken, getPatientServices);


export default router;