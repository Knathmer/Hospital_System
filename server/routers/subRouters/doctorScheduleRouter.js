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
  getAppointmentInformation,
  getPreviousAppointments,
  putMissedAppointment,
  getPatientMedication,
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
doctorScheduleRouter.get("/appointment-info", getAppointmentInformation);
doctorScheduleRouter.get("/previous-appointments", getPreviousAppointments);
doctorScheduleRouter.get("/patient-medication", getPatientMedication);

export default doctorScheduleRouter;
