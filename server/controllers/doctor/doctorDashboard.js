import { SELECT_DOCTOR_APPOINTMENTS } from "../../queries/constants/selectQueries.js";
import pool from "../../database.js";

export async function getDoctorAppointments(req, res) {
  const doctorID = req.user.doctorID; // Assuming doctorID is extracted from the token

  try {
    const [rows] = await pool.query(SELECT_DOCTOR_APPOINTMENTS, [doctorID]);
    const appointments = rows.map((row) => ({
      status: row.appointmentStatus,
      patientName: `${row.patientFirstName} ${row.patientLastName}`,
      date: new Date(row.appointmentDateTime).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date(row.appointmentDateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPatientsByDoctor(req, res) {
  const doctorID = req.user.doctorID; // Assuming doctorID is extracted from the token

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        pd.patientID, 
        p.firstName AS patientFirstName, 
        p.lastName AS patientLastName, 
        pd.isPrimary
      FROM 
        patient_doctor AS pd
      JOIN 
        patient AS p ON pd.patientID = p.patientID
      WHERE 
        pd.doctorID = ?;
      `,
      [doctorID]
    );

    const patients = rows.map((row) => ({
      patientID: row.patientID,
      patientName: `${row.patientFirstName} ${row.patientLastName}`,
      isPrimary: row.isPrimary === 1 ? "Primary" : "Secondary",
    }));

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function getOfficeByDoctor(req, res) {
  const doctorID = req.user.doctorID; // Assuming doctorID is extracted from the token

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        o.officeName, 
        a.addrStreet AS addressStreet, 
        a.addrcity AS city, 
        a.addrstate AS state, 
        a.addrzip AS zipCode, 
        o.officePhoneNumber, 
        o.officeEmail
      FROM 
        office AS o
      JOIN 
        address AS a ON o.addressID = a.addressID
      JOIN 
        doctor AS d ON d.officeID = o.officeID
      WHERE 
        d.doctorID = ?;
      `,
      [doctorID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No office found for this doctor." });
    }

    const office = {
      officeName: rows[0].officeName,
      address: `${rows[0].addressStreet}, ${rows[0].city}, ${rows[0].state} ${rows[0].zipCode}`,
      phone: rows[0].officePhoneNumber,
      email: rows[0].officeEmail,
    };

    res.status(200).json(office);
  } catch (error) {
    console.error("Error fetching office information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
