import { query } from "../../database.js";
import pool from "../../database.js";
import { SELECT_DOCTOR_NAMES } from "../../queries/constants/selectQueries.js";

export async function welcomeDocName(req, res) {
  const doctorID = req.user.doctorID;

  try {
    const [rows] = await pool.query(SELECT_DOCTOR_NAMES, [doctorID]);
    if (rows.length > 0) {
      const { firstName, lastName } = rows[0];
      res.status(200).json({ firstName, lastName });
    } else {
      res.status(404).json({ error: "Doctor not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}