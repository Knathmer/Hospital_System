import express from "express";
import { getDoctorSchedule } from "../../controllers/doctor/doctorScheduleController.js";

const doctorScheduleRouter = express.Router();

doctorScheduleRouter.get("/", getDoctorSchedule);

export default doctorScheduleRouter;
