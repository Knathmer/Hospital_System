import { query } from "../../database.js";
import {
  GET_DOCTOR_SCHEDULE,
  GET_PATIENT_INFO_DOC_APPT,
} from "../../queries/constants/selectQueries.js";

export const getDoctorSchedule = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const startOfDayStr = startOfDay
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace("T", " ");

    const doctorID = req.user.doctorID;
    const doctorSchedule = await query(GET_DOCTOR_SCHEDULE, [
      doctorID,
      startOfDayStr,
      endOfDayStr,
    ]);

    if (doctorSchedule.length === 0) {
      return res.status(200).json({
        message: "Doctor does not have any scheduled appointments for today",
      });
    }

    res.status(200).json({ doctorSchedule });
  } catch (error) {
    console.error("Error fetching doctor's daily schedule", error);
    res.status(500).json({ message: "Server error fetching schedule" });
  }
};

export const putMissedAppointment = async (req, res) => {
  try {
    const { appointmentID, status } = req.body;

    const [result] = await query(
      "UPDATE appointment a SET a.status = ?  WHERE a.appointmentID = ? AND a.status <> ?;",
      [status, appointmentID, status]
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No updates made" });
    }
    res.json({ success: true, message: "Appointment status updated." });
  } catch (error) {}
};

export const getPatientInformation = async (req, res) => {
  try {
    const doctorID = req.user.doctorID;
    const { appointmentID } = req.query;

    if (!appointmentID) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const [patientInfo] = await query(GET_PATIENT_INFO_DOC_APPT, [
      appointmentID,
      doctorID,
    ]);

    if (!patientInfo) {
      return res.status(200).json({ message: "Patient not found!" });
    }

    res.status(200).json({ patientInfo });
  } catch (error) {
    console.error("Error fetching patient information ", error);
    res.status(500).json({ message: "Server error fetching patient info" });
  }
};
