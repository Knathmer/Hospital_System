import express from "express";
const medicationRouter = express.Router();
import {
  getPatientMedications,
  getPatientPharmacy,
  getRefillHistory,
  postPatientRefill,
} from "../../controllers/patient/patientMedicationsControllers.js";

//GET request at path "/auth/patient/medications"
medicationRouter.get("/", getPatientMedications);

//GET request at path "auth/patient/medications/manage-pharmacies"
//Once you go to that path it will either print out the information of a pharmacy or display that there is no pharmacy.
medicationRouter.get("/manage-pharmacies", getPatientPharmacy);

medicationRouter.post("/refill", postPatientRefill);

medicationRouter.get("/refill-history", getRefillHistory);

export default medicationRouter;
