import express from "express";
import { getCurrentPastBalance } from "../../controllers/patient/patientBillingController.js";
const billingRouter = express.Router();

billingRouter.get("/current-balance", getCurrentPastBalance);

export default billingRouter;
