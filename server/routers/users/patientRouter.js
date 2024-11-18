// routers/users/patientRouter.js

import express from "express";
import {
  postMedicalHistory,
  hasMedHistoryInfo,
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
import patientDoctorRouter from "../../controllers/patient/patient_doctor.js"; // Ensure correct path

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

// Since medications have many sub-routes
router.use("/medications", medicationRouter);

// Billing routes
router.use("/billing", billingRouter);

// Pharmacy routes
router.get("/pharmacies", getAllPharmacies);
router.delete(`/pharmacies/:pharmacyID`, deletePharmacyFromPatient);
router.post("/pharmacies", postNewPharmacy);
router.post("/pharmacies/add", postToPatientPharmacy);

// Mount the patientDoctorRouter
router.use('/', patientDoctorRouter);

export default router;
