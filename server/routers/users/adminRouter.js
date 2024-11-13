// routers/users/adminRouter.js
import express from 'express';
import { registerDoctor } from "../../controllers/authController.js";
import { getOfficeLocations, getSpecialties, generateDoctorReport } from "../../controllers/admin/reportController.js"

const router = express.Router();

router.post('/register', registerDoctor);

// Endpoint to get office locations
router.get('/getOfficeLocations', getOfficeLocations);

// Endpoint to get doctor specialties
router.get('/getSpecialties', getSpecialties);

// Endpoint to generate doctor report
router.get('/generateDoctorReport', generateDoctorReport);

export default router;
