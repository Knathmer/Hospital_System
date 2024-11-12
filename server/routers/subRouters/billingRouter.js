import express from "express";
import {
  getCurrentPastBalance,
  getLastPaymentInformation,
  getPatientInformation,
  getOfficeInformation,
  getRecentPayments,
  getDetailsYTD,
  getDetailsLastYear,
  getDetailsDateRange,
  getPaymentsYTD,
  getPaymentsLastYear,
  getPaymentsDateRange,
} from "../../controllers/patient/patientBillingController.js";
const billingRouter = express.Router();

//Overview
billingRouter.get("/current-balance", getCurrentPastBalance);
billingRouter.get("/last-payment-summary", getLastPaymentInformation);
billingRouter.get("/patient-information", getPatientInformation);
billingRouter.get("/office-information", getOfficeInformation);
billingRouter.get("/recent-payments", getRecentPayments);

//Details
billingRouter.get("/details/ytd", getDetailsYTD);
billingRouter.get("/details/last-year", getDetailsLastYear);
billingRouter.get("/details/date-range", getDetailsDateRange);

//Payments
billingRouter.get("/payments/ytd", getPaymentsYTD);
billingRouter.get("/payments/last-year", getPaymentsLastYear);
billingRouter.get("/payments/date-range", getPaymentsDateRange);

export default billingRouter;
