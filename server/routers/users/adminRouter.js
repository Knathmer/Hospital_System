import express from "express";
import { registerDoctor } from "../../controllers/authController.js";
import { getPrescriptionReport } from "../../controllers/admin/adminPrescriptionReport.js";
const router = express.Router();

router.post("/register", registerDoctor);
router.get("/get-prescription-report", getPrescriptionReport);

export default router;
