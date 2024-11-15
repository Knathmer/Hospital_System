import { query } from "../../database.js";
import { GET_DOCTOR_SCHEDULE } from "../../queries/constants/selectQueries.js";

export const getDoctorSchedule = async (req, res) => {
  try {
    const doctorID = req.user.doctorID;

    const doctorSchedule = await query(GET_DOCTOR_SCHEDULE, [doctorID]);

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
