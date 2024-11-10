import express from "express";
import {
  getCurrentPastBalance,
  getLastPaymentInformation,
} from "../../controllers/patient/patientBillingController.js";
const billingRouter = express.Router();

billingRouter.get("/current-balance", getCurrentPastBalance);
billingRouter.get("/last-payment-summary", getLastPaymentInformation);

export default billingRouter;
