import express from 'express';
import { 
  getOfficeLocations, 
  getSpecialties, 
  generateDoctorReport,
  getStates,
  getCities,
  getDoctors
} from "../../controllers/admin/reportController.js"

const router = express.Router();

// Endpoint to get office locations
router.get('/getOfficeLocations', getOfficeLocations);

// Endpoint to get doctor specialties
router.get('/getSpecialties', getSpecialties);

// Endpoint to generate doctor report
router.get('/generateDoctorReport', generateDoctorReport);

// Endpoint to get states
router.get('/getStates', getStates);

// Endpoint to get cities
router.get('/getCities', getCities);

// Endpoint to get doctors
router.get('/getDoctors', getDoctors);

export default router;