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


export async function getDoctorsBySpecialty(req, res) {
    const { specialty, gender, location } = req.query;

    try {
        let queryStr = `
            SELECT 
                doctor.doctorID, 
                doctor.firstName, 
                doctor.lastName, 
                doctor.gender, 
                doctor.workPhoneNumber, 
                doctor.workEmail,
                doctor.specialty, 
                office.officeName AS officeLocation,
                CONCAT(addrStreet, ', ', addrcity, ', ', addrstate, ' ', addrzip) AS officeAddress
            FROM doctor
            LEFT JOIN office ON doctor.officeID = office.officeID
            JOIN address ON office.addressID = address.addressID
            WHERE 1=1
        `;
        const params = [];

        if (specialty) {
            queryStr += " AND doctor.specialty = ?";
            params.push(specialty);
        }

        if (gender) {
            queryStr += " AND doctor.gender = ?";
            params.push(gender);
        }

        if (location) {
            queryStr += " AND office.officeName = ?";
            params.push(location);
        }

        queryStr += " ORDER BY doctor.specialty, doctor.gender, office.officeName";

        const doctors = await query(queryStr, params);
        res.json(doctors);
    } catch (error) {
        console.error("Error retrieving doctors:", error);
        res.status(500).json({ error: "Error retrieving doctors" });
    }
}



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
             VALUES (?, ?, 'Requested', ?, ?)`,
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
             AND status IN ('Requested', 'Scheduled')`, // Include 'Requested' status
            [doctorID, startOfDay, endOfDay]
        );

        // Extract times in consistent format
        const bookedTimes = appointments.map(app => {
            const dateObj = new Date(app.appointmentDateTime);
            return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        });

        res.json({ bookedTimes });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Error fetching appointments" });
    }
}

// Function to get appointments for the logged-in doctor
export async function getDoctorAppointments(req, res) {
    const doctorID = req.user.doctorID; // Get doctorID from token

    if (!doctorID) {
        return res.status(401).json({ error: "Doctor must be logged in" });
    }

    try {
        const appointments = await query(
            `SELECT appointment.*, 
                    patient.firstName as patientFirstName, 
                    patient.lastName as patientLastName,
                    patient.dateOfBirth as patientDOB,
                    patient.gender as patientGender,
                    patient.phoneNumber as patientPhoneNumber,
                    patient.email as patientEmail
             FROM appointment
             JOIN patient ON appointment.patientID = patient.patientID
             WHERE appointment.doctorID = ?`,
            [doctorID]
        );

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Error fetching appointments" });
    }
}

// Function to update an appointment
export async function updateAppointment(req, res) {
    const doctorID = req.user.doctorID;
    if (!doctorID) {
        return res.status(401).json({ error: "Doctor must be logged in" });
    }

    const { appointmentID, reason, status } = req.body;

    try {
        // Update the appointment if it belongs to the doctor
        const result = await query(
            `UPDATE appointment SET reason = ?, status = ?
             WHERE appointmentID = ? AND doctorID = ?`,
            [reason, status, appointmentID, doctorID]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Appointment updated successfully' });
        } else {
            res.status(404).json({ error: 'Appointment not found or not authorized' });
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Error updating appointment' });
    }
}

// Function to get unique office locations
export async function getLocations(req, res) {
    try {
        const locations = await query(`
            SELECT officeID, officeName, CONCAT(addrStreet, ', ', addrcity, ', ', addrstate, ' ', addrzip) AS address
            FROM office
            JOIN address ON office.addressID = address.addressID
        `);
        res.json(locations);
    } catch (error) {
        console.error("Error retrieving locations:", error);
        res.status(500).json({ error: "Error retrieving locations" });
    }
}