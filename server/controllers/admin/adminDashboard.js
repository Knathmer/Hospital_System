import { query } from "../../database.js";
import pool from "../../database.js";
import { SELECT_TOTAL_PATIENT, SELECT_TOTAL_DOC, SELECT_TOTAL_ADMIN, SELECT_TOTAL_APPOINTMENT, SELECT_UPCOMING_APPOINTMENTS_ADMIN, SELECT_DOCTORS_WITH_SPECIALTY} from "../../queries/constants/selectQueries.js";

// total users  
export async function totalPatients(req,res){
    // const adminID = req.user.adminID;

    try {
        const [rows] = await pool.query(SELECT_TOTAL_PATIENT);
        const {totalPatient} = rows[0];
        res.status(200).json({totalPatient});
    } catch(error){
        console.error("Error fetching patient:", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function totalDoctors(req,res){
    try{
        const [rows] = await pool.query(SELECT_TOTAL_DOC);
        const {totalDoctors} = rows[0];
        res.status(200).json({totalDoctors});
    } catch (error) {
        console.error("Error fetching patient: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function totalAdmins(req, res){
    try{
        const [rows] = await pool.query(SELECT_TOTAL_ADMIN);
        const {totalAdmin} = rows[0];
        res.status(200).json({totalAdmin});
    } catch (error){
        console.error("Error fetching admin: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function totalAppointments(req, res) {
    try {
        const [rows] = await pool.query(SELECT_TOTAL_APPOINTMENT);
        const { totalAppointments } = rows[0];
        res.status(200).json({ totalAppointments });
    } catch (error) {
        console.error("Error fetching total appointments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getUpcomingAppointmentAdmin(req, res) {
    try {
      const [rows] = await pool.query(SELECT_UPCOMING_APPOINTMENTS_ADMIN);
      const appointments = rows.map((row) => ({
        doctor: `${row.doctorFirstName} ${row.doctorLastName}`,
        patient: `${row.patientFirstName} ${row.patientLastName}`,
        date: new Date(row.appointmentDateTime).toLocaleDateString("en-US", { weekday: 'long' }),
        time: new Date(row.appointmentDateTime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
      }));
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  export async function listOfDocAdmin(req, res) {
    try {
      const [rows] = await pool.query(SELECT_DOCTORS_WITH_SPECIALTY);
      const doctors = rows.map((row) => ({
        name: `${row.firstName} ${row.lastName}`,
        specialty: row.specialtyName,
      }));
      res.status(200).json(doctors);
    } catch (error) {
      console.error("Error fetching doctors list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }