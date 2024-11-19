import express from "express";
//import { doctorController } from '../../controllers/doctorController.js';
import { getPatientInfo } from "../../controllers/doctor/patientController.js";
import doctorScheduleRouter from "../subRouters/doctorScheduleRouter.js";

const router = express.Router();

router.get("/patient/:patientID", getPatientInfo);

router.use("/schedule", doctorScheduleRouter);
export default router;
