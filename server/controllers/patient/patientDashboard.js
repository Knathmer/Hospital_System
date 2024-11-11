// import { query } from "express";
import pool from "../../database.js";
import { SELECT_UPCOMING_APPOINTMENTS_DB, SELECT_RECENT_MED_REQ_DB, SELECT_NOTIFICATIONS_DB } from "../../queries/constants/selectQueries.js";

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

// export async function getMedsResultsComponent(req, res){
//     const patientID = req.user.patientID;

//     try{
//         const [rows] = await pool.query(SELECT_RECENT_MED_REQ_DB, [patientID]);
//         if (rows.length > 0){
//             res.status(200).json(rows);
//         }
//         else{
//             res.status(404).json({error: "No medication results were found"});
//         }
//     } catch (error){
//         res.status(500).json({error: "Internal server error"});
//     }
    
// }
export async function getMedsResultsComponent(req, res) {
    const patientID = req.user.patientID;
  
    try {
      const [rows] = await pool.query(SELECT_RECENT_MED_REQ_DB, [patientID]);
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(200).json([]); // Return empty array if no results are found
      }
    } catch (error) {
      console.error("Database error:", error); // Log the error for debugging
      res.status(500).json({ error: "Internal server error" });
    }
  }
  

export async function getNotificationComponent(req,res){
    const patientID = req.user.patientID;

    try{
        const [rows] = await pool.query(SELECT_NOTIFICATIONS_DB, [patientID]);
        if (rows.length > 0){
            res.status(200).json(rows);
        }
        else {
            res.status(404).json({error: "No notification results were found"});
        }
    } catch (error){
        res.status(500).json({error: "Internal server error"});
    }
}