import express from "express";
import { postMedicalHistory } from "../../controllers/patient/patientMedicalHistoryController.js";
import {
  postInsurance,
  hasInsuranceInfo,
  updateInsurance,
} from "../../controllers/patient/patientInsuranceController.js";
import medicationRouter from "../subRouters/medicationRouter.js";
import { getAllPharmacies } from "../../controllers/patient/patientController.js";

const router = express.Router();

router.post("/medical-history", postMedicalHistory);
router.post("/insurance", postInsurance);
router.get("/insurance-info", hasInsuranceInfo);
router.put("/update-insurance", updateInsurance);

//Since medications will have many sub routes, create a sub router for the path "/auth/patient/medications/*"
router.use("/medications", medicationRouter);

router.get("/pharmacies", getAllPharmacies);

export default router;
