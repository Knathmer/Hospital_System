import express from "express";
import { getPatientMedication } from "../../controllers/patientController.js";

const router = express.Router();

router.get("/prescription", getPatientMedication);

export default router;
