import express from "express";
import {
  getCurrentPastBalance,
  getLastPaymentInformation,
  getPatientInformation,
  getOfficeInformation,
} from "../../controllers/patient/patientBillingController.js";
const billingRouter = express.Router();

billingRouter.get("/current-balance", getCurrentPastBalance);
billingRouter.get("/last-payment-summary", getLastPaymentInformation);
billingRouter.get("/patient-information", getPatientInformation);
billingRouter.get("/office-information", getOfficeInformation);

export default billingRouter;
