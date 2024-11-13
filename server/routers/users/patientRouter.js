import express from "express";
import {
  hasMedHistoryInfo,
  postMedicalHistory,
} from "../../controllers/patient/patientMedicalHistoryController.js";
import {
  postInsurance,
  hasInsuranceInfo,
  updateInsurance,
} from "../../controllers/patient/patientInsuranceController.js";
import medicationRouter from "../subRouters/medicationRouter.js";
import billingRouter from "../subRouters/billingRouter.js";
import {
  getAllPharmacies,
  postNewPharmacy,
  postToPatientPharmacy,
  deletePharmacyFromPatient,
} from "../../controllers/patient/pharmacyController.js";
import {
  removeMedHistory,
  updateMedHistory,
} from "../../controllers/patient/patientEditMedicalHistoryController.js";
import {
  hasPersonalInfo,
  updatePersonalInfo,
} from "../../controllers/patient/patientPersonalInfoController.js";
// import { de } from "date-fns/locale";

const router = express.Router();

router.post("/medical-history", postMedicalHistory);
router.get("/medical-history-info", hasMedHistoryInfo);
router.post("/insurance", postInsurance);
router.get("/insurance-info", hasInsuranceInfo);
router.put("/update-insurance", updateInsurance);
router.delete("/remove-medical-history", removeMedHistory);
router.post("/update-medical-history", updateMedHistory);
router.get("/personal-info", hasPersonalInfo);
router.put("/update-personal-info", updatePersonalInfo);

//Since medications will have many sub routes, create a sub router for the path "/auth/patient/medications/*"
router.use("/medications", medicationRouter);

router.use("/billing", billingRouter);

router.get("/pharmacies", getAllPharmacies);
router.delete(`/pharmacies/:pharmacyID`, deletePharmacyFromPatient);
router.post("/pharmacies", postNewPharmacy);
router.post("/pharmacies/add", postToPatientPharmacy);

export default router;
