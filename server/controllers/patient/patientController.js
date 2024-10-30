// controllers/patient/patientController.js
import { query } from "../../database.js";
import pool from "../../database.js";
import { SELECT_PATIENT_NAMES } from "../../queries/constants/selectQueries.js";

export async function welcomeUserName(req, res) {
  const patientID = req.user.patientID;

  try {
    // console.log("Running query:", SELECT_PATIENT_NAMES, "with patientID:", patientID);
    const [rows] = await pool.query(SELECT_PATIENT_NAMES, [patientID]);
    if (rows.length > 0) {
      const { firstName, lastName } = rows[0];
      res.status(200).json({ firstName, lastName });
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}