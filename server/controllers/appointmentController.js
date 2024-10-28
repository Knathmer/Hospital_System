import { query } from "../database.js"; // Import query function
import pool from "../database.js"; // Import pool for transactions

// Function to get specialties
export async function getSpecialties(req, res) {
    try {
        // Query the database to get unique specialties from the doctor table
        const specialties = await query(
            "SELECT DISTINCT specialty FROM doctor"
        );

        res.json(specialties);
    } catch (error) {
        console.error("Error retrieving specialties:", error);
        res.status(500).json({ error: "Error retrieving specialties" });
    }
}


// Function to get doctors by specialty
export async function getDoctorsBySpecialty(req, res) {
    const { specialty } = req.query; // Retrieve specialty from query params

    if (!specialty) {
        return res.status(400).json({ error: "Specialty is required" });
    }

    try {
        const doctors = await query(
            "SELECT doctorID, firstName, lastName FROM doctor WHERE specialty = ?",
            [specialty]
        );

        res.json(doctors);
    } catch (error) {
        console.error("Error retrieving doctors:", error);
        res.status(500).json({ error: "Error retrieving doctors" });
    }
};

// Function to book an appointment
export async function bookAppointment(req, res) {
    const { appointmentDateTime, reason, doctorID } = req.body;
    const patientID = req.user.patientID; // Get the patientID from the verified JWT

    if (!patientID) {
        return res.status(401).json({ message: "Patient must be logged in to book an appointment" });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if the appointment time is already booked for the same doctor
        const [existingAppointments] = await connection.query(
            "SELECT * FROM appointment WHERE doctorID = ? AND appointmentDateTime = ?",
            [doctorID, appointmentDateTime]
        );

        if (existingAppointments.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Time slot is already booked" });
        }

        // Book the appointment
        await connection.query(
            `INSERT INTO appointment 
             (appointmentDateTime, reason, status, patientID, doctorID)
             VALUES (?, ?, 'Scheduled', ?, ?)`,
            [appointmentDateTime, reason, patientID, doctorID]
        );

        await connection.commit();
        return res.status(200).json({ message: "Appointment booked successfully" });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Error booking appointment:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// Function to get appointments for a doctor on a specific date
export async function getAppointmentsByDoctorAndDate(req, res) {
    const { doctorID, date } = req.query;

    if (!doctorID || !date) {
        return res.status(400).json({ error: "doctorID and date are required" });
    }

    try {
        // Assuming appointmentDateTime is stored in ISO format
        const startOfDay = `${date}T00:00:00`;
        const endOfDay = `${date}T23:59:59`;

        const appointments = await query(
            `SELECT appointmentDateTime FROM appointment 
             WHERE doctorID = ? 
             AND appointmentDateTime BETWEEN ? AND ? 
             AND status = 'Scheduled'`,
            [doctorID, startOfDay, endOfDay]
        );

        // Extract times in HH:MM format
        const bookedTimes = appointments.map(app => {
            const dateObj = new Date(app.appointmentDateTime);
            return dateObj.toTimeString().substring(0, 5); // "HH:MM"
        });

        res.json({ bookedTimes });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Error fetching appointments" });
    }
}