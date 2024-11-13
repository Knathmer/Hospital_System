// controllers/admin/reportController.js
import pool from "../../database.js";

// Controller function to get office locations
export const getOfficeLocations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT officeID, officeName FROM office');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching office locations:', error);
    res.status(500).send('Server Error');
  }
};

// Controller function to get doctor specialties
export const getSpecialties = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT specialty FROM doctor');
    const specialties = rows.map((row) => row.specialty);
    res.json(specialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).send('Server Error');
  }
};

// Controller function to generate doctor report
// Updated controller function to remove non-existent field 'route'
export const generateDoctorReport = async (req, res) => {
  const { officeID, specialty, gender, startDate, endDate } = req.query;

  try {
    let doctorQuery = `
      SELECT
        d.doctorID,
        d.firstName,
        d.lastName,
        d.specialty,
        d.gender
      FROM doctor d
      WHERE 1=1
    `;

    const params = [];

    if (officeID) {
      doctorQuery += ' AND d.officeID = ?';
      params.push(officeID);
    }

    if (specialty) {
      doctorQuery += ' AND d.specialty = ?';
      params.push(specialty);
    }

    if (gender) {
      doctorQuery += ' AND d.gender = ?';
      params.push(gender);
    }

    doctorQuery += `
      ORDER BY d.lastName, d.firstName
    `;

    // Fetch doctors based on filters
    const [doctors] = await pool.query(doctorQuery, params);

    // For each doctor, fetch appointments and prescriptions
    const detailedData = await Promise.all(doctors.map(async (doctor) => {
      // Fetch appointments for the doctor
      let appointmentQuery = `
        SELECT
          a.appointmentID,
          a.appointmentDateTime,
          a.title,
          a.reason,
          a.status,
          p.patientID,
          p.firstName AS patientFirstName,
          p.lastName AS patientLastName
        FROM appointment a
        INNER JOIN patient p ON a.patientID = p.patientID
        WHERE a.doctorID = ?
      `;
      const appointmentParams = [doctor.doctorID];

      if (startDate) {
        appointmentQuery += ' AND a.appointmentDateTime >= ?';
        appointmentParams.push(startDate);
      }

      if (endDate) {
        appointmentQuery += ' AND a.appointmentDateTime <= ?';
        appointmentParams.push(endDate);
      }

      const [appointments] = await pool.query(appointmentQuery, appointmentParams);

      // Fetch prescriptions for the doctor
      let prescriptionQuery = `
        SELECT
          pr.prescriptionID,
          pr.medicationName,
          pr.dosage,
          pr.frequency,
          pr.start,
          pr.end,
          pr.patientID,
          pr.dateIssued,
          pr.activeStatus,
          p.firstName AS patientFirstName,
          p.lastName AS patientLastName
        FROM prescription pr
        INNER JOIN patient p ON pr.patientID = p.patientID
        WHERE pr.doctorID = ?
      `;
      const prescriptionParams = [doctor.doctorID];

      if (startDate) {
        prescriptionQuery += ' AND pr.dateIssued >= ?';
        prescriptionParams.push(startDate);
      }

      if (endDate) {
        prescriptionQuery += ' AND pr.dateIssued <= ?';
        prescriptionParams.push(endDate);
      }

      const [prescriptions] = await pool.query(prescriptionQuery, prescriptionParams);

      return {
        ...doctor,
        appointments,
        prescriptions,
      };
    }));

    res.json(detailedData);
  } catch (error) {
    console.error('Error generating doctor report:', error);
    res.status(500).send('Server Error');
  }
};
