import express from "express";
import { getPatientMedication } from "../../controllers/patientController.js";

router.get("/medication", getPatientMedication);

const router = express.Router();

export default router;
