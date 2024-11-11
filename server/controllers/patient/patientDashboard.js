// import { query } from "express";
import pool from "../../database.js";
import { SELECT_UPCOMING_APPOINTMENTS_DB, SELECT_RECENT_MED_REQ_DB } from "../../queries/constants/selectQueries.js";

export async function getAppointmentsComponent(req,res){
    const patientID = req.user.patientID;

    try{
        const [rows] = await pool.query(SELECT_UPCOMING_APPOINTMENTS_DB, [patientID]);
        if (rows.length > 0){
            res.status(200).json(rows);
        }
        else{
            res.status(404).json({error: "No upcoming appointments were found"});
        }
    } catch (error){
        res.status(500).json({error: "Internal server error"});
    }
}

export async function getMedsResultsComponent(req, res) {
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