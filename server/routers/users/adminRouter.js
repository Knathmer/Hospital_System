import express from "express";
import { registerDoctor } from "../../controllers/authController.js";
import { getPrescriptionReport } from "../../controllers/admin/adminPrescriptionReport.js";
import {
  getAppointmentAnalytics,
  getStates,
  getCities,
  getOffices,
  getDoctors,
  getPatients,
  getAppointmentStatuses,
  getVisitTypes,
  getSpecialties,
  getServices,
} from "../../controllers/admin/appointmentAnalytics.js";
import {
    getAllDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor
  } from "../../controllers/admin/doctorController.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.get("/get-prescription-report", getPrescriptionReport);
router.post("/register", registerDoctor);
router.get("/appointmentAnalytics", getAppointmentAnalytics);
router.get("/states", getStates);
router.get("/cities", getCities);
router.get("/offices", getOffices);
router.get("/doctors", getDoctors);
router.get("/patients", getPatients);
router.get("/statuses", getAppointmentStatuses);
router.get("/visitTypes", getVisitTypes);
router.get("/specialties", getSpecialties);
router.get("/services", getServices);

router.get("/doctors", getAllDoctors); // Fetch all doctors
router.post("/doctors", addDoctor); // Add a new doctor
router.put("/doctors/:doctorID", updateDoctor); // Update an existing doctor
router.delete("/doctors/:doctorID", deleteDoctor); // Delete a doctor

export default router;
