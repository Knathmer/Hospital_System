import express from "express";
import { postMedicalHistory } from "../../controllers/patient/patientMedicalHistoryController.js";
import { postInsurance } from "../../controllers/patient/patientInsuranceController.js";
//import { patientController } from '../../controllers/patientController.js';

const router = express.Router();

router.post("/medical-history", postMedicalHistory);
router.post("/insurance", postInsurance);

export default router;
