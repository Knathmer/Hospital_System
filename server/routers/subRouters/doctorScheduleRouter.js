import express from "express";
import {
  getDoctorSchedule,
  getPatientInformation,
  getInsuranceInformation,
  getAllergiesInformation,
  getDisabilitiesInformation,
  getFamilyHistoryInformation,
  getSurgeriesInformation,
  getVaccinesInformation,
  putMissedAppointment,
} from "../../controllers/doctor/doctorScheduleController.js";

const doctorScheduleRouter = express.Router();

doctorScheduleRouter.get("/", getDoctorSchedule);

doctorScheduleRouter.put("/missed-appointment", putMissedAppointment);

//Appointment Handler Page GET Requests
doctorScheduleRouter.get("/patient-info", getPatientInformation);
doctorScheduleRouter.get("/insurance-info", getInsuranceInformation);
doctorScheduleRouter.get("/allergy-info", getAllergiesInformation);
doctorScheduleRouter.get("/disability-info", getDisabilitiesInformation);
doctorScheduleRouter.get("/vaccine-info", getVaccinesInformation);
doctorScheduleRouter.get("/surgery-info", getSurgeriesInformation);
doctorScheduleRouter.get("/family-info", getFamilyHistoryInformation);

export default doctorScheduleRouter;
