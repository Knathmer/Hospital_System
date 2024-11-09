import express from "express";
const medicationRouter = express.Router();
import {
  getPatientMedications,
  getPatientPharmacy,
  getRefillHistory,
  postPatientRefill,
  getPendingRequests,
  updateMedicationPharmacyID,
} from "../../controllers/patient/patientMedicationsControllers.js";

//GET request at path "/auth/patient/medications"
medicationRouter.get("/", getPatientMedications);

//GET request at path "auth/patient/medications/manage-pharmacies"
//Once you go to that path it will either print out the information of a pharmacy or display that there is no pharmacy.
medicationRouter.get("/manage-pharmacies", getPatientPharmacy);
medicationRouter.get("/refill-history", getRefillHistory);
medicationRouter.get("/pending-requests", getPendingRequests);

medicationRouter.post("/refill", postPatientRefill);

medicationRouter.put(`/:prescriptionID/pharmacy`, updateMedicationPharmacyID);

export default medicationRouter;
