import express from "express";
import { postMedicalHistory } from "../../controllers/patient/patientMedicalHistoryController.js";
import { getPatientMedications } from "../../controllers/patient/patientMedicationsControllers.js";
//import { patientController } from '../../controllers/patientController.js';

const router = express.Router();

router.post("/medical-history", postMedicalHistory);
router.get("/medications", getPatientMedications);

export default router;
