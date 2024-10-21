import express from "express";
import { postMedicalHistory } from "../../controllers/patient/patientMedicalHistoryController.js";
//import { patientController } from '../../controllers/patientController.js';

const router = express.Router();

router.post("/medical-history", postMedicalHistory);

export default router;
