import express from "express";
import {
  getDoctorSchedule,
  getPatientInformation,
  putMissedAppointment,
} from "../../controllers/doctor/doctorScheduleController.js";

const doctorScheduleRouter = express.Router();

doctorScheduleRouter.get("/", getDoctorSchedule);

doctorScheduleRouter.put("/missed-appointment", putMissedAppointment);

//Appointment Handler Page GET Requests
doctorScheduleRouter.get("/patient-info", getPatientInformation);

export default doctorScheduleRouter;
