import express from "express";
import {
  getDoctors,
  getFinancialOverview,
  getOffices,
  getServices,
} from "../../controllers/admin/financialReport.js";
const billingReportRouter = express.Router();

billingReportRouter.get("/financial-overview", getFinancialOverview);
billingReportRouter.get("/doctors", getDoctors);
billingReportRouter.get("/offices", getOffices);
billingReportRouter.get("/services", getServices);

export default billingReportRouter;
