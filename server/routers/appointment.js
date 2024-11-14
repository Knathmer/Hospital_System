import express from "express";
import {
  getSpecialties,
  bookAppointment,
  getDoctorsBySpecialty,
  getAppointmentsByDoctorAndDate,
  getServices,
  getLocations,
  getDoctorAppointments,
  updateAppointment,
} from "../controllers/appointmentController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/specialties", getSpecialties);
router.get("/locations", getLocations);
router.get("/services", getServices);
router.get("/doctors", getDoctorsBySpecialty);
router.post("/book", verifyToken, bookAppointment);
router.get("/appointments", getAppointmentsByDoctorAndDate);
router.get("/doctorAppointments", verifyToken, getDoctorAppointments);
router.put("/updateAppointment", verifyToken, updateAppointment);

export default router;
