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
  deactivateMedication,
  reactivateMedication,
  getPharmacies,
  postNewMedication,
  refillMedication,
  getAdditionalCharges,
  saveCharges,
  addAllergy,
  addDisability,
  addVaccine,
  addSurgery,
  addFamilyHistory,
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
doctorScheduleRouter.get("/get-pharmacies", getPharmacies);
doctorScheduleRouter.get("/additional-charges", getAdditionalCharges);

//Appointment Handler PUT Requests
doctorScheduleRouter.put("/deactivate-medication", deactivateMedication);
doctorScheduleRouter.put("/reactivate-medication", reactivateMedication);
doctorScheduleRouter.put("/refill-medication", refillMedication);

//Appointment Handler POST
doctorScheduleRouter.post("/add-medication", postNewMedication);
doctorScheduleRouter.post("/save-charges", saveCharges);
doctorScheduleRouter.post("/add-allergy", addAllergy);
doctorScheduleRouter.post("/add-disability", addDisability);
doctorScheduleRouter.post("/add-vaccine", addVaccine);
doctorScheduleRouter.post("/add-surgery", addSurgery);
doctorScheduleRouter.post("/add-family-history", addFamilyHistory);

export default doctorScheduleRouter;
