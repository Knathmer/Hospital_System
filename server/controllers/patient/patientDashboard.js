// import { query } from "express";
import pool from "../../database.js";
import { SELECT_UPCOMING_APPOINTMENTS_DB, SELECT_RECENT_MED_REQ_DB, SELECT_BILLING_DB } from "../../queries/constants/selectQueries.js";

export async function getAppointmentsDashboard(req, res) {
    const patientID = req.user.patientID;

    try {
        const [rows] = await pool.query(SELECT_UPCOMING_APPOINTMENTS_DB, [patientID]);
        res.status(200).json(rows); // Always return 200, even if rows is empty
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function getMedsResultsDashboard(req, res) {
  const patientID = req.user.patientID;

  try {
    const [rows] = await pool.query(SELECT_RECENT_MED_REQ_DB, [patientID]);
    // console.log("Fetched rows:", rows); 
    if (rows.length > 0) {
      res.status(200).json(rows); 
    } else {
      res.status(200).json([]); 
    }
  } catch (error){
    console.error("Error fetching medication results:", error);
    res.status(500).json({error: "Internal server error"});
}
}

export async function getBillDashboard(req, res) {
    const patientID = req.user.patientID;
    // console.log("Fetching billing data for patientID:", patientID);

    try {
        const [rows] = await pool.query(SELECT_BILLING_DB, [patientID]);
        // console.log("Query result:", rows);
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ error: "No billing was found" });
        }
    } catch (error) {
        console.error("Error in getBillDashboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
