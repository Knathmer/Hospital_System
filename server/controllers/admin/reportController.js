// controllers/admin/reportController.js
import pool from '../../database.js';

// Fetch Office Locations
export const getOfficeLocations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT officeID, officeName FROM office');
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error fetching office locations');
  }
};

// Fetch Specialties
export const getSpecialties = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT specialtyID, specialtyName FROM Specialty');
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error fetching specialties');
  }
};

// Fetch States
export const getStates = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT addrstate AS value FROM address JOIN office o ON address.addressID = o.addressID');
    res.json(rows.map((row) => ({ value: row.value, label: row.value })));
  } catch (error) {
    res.status(500).send('Error fetching states');
  }
};

// Fetch Cities
export const getCities = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT addrcity AS value FROM address JOIN office o ON address.addressID = o.addressID');
    res.json(rows.map((row) => ({ value: row.value, label: row.value })));
  } catch (error) {
    res.status(500).send('Error fetching cities');
  }
};

// Fetch Doctors
export const getDoctors = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT doctorID AS value, CONCAT(firstName, " ", lastName) AS label FROM doctor'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error fetching doctors');
  }
};

// Generate Doctor Report
export const generateDoctorReport = async (req, res) => {
  const { officeID, specialtyID, gender, state, city, doctorID, startDate, endDate } = req.query;

  const buildArrayParam = (param) => {
    if (!param) return []; // Return empty array if param is undefined or null
    return Array.isArray(param) ? param : [param];
  };

  const officeIDs = buildArrayParam(officeID);
  const specialtyIDs = buildArrayParam(specialtyID);
  const genders = buildArrayParam(gender);
  const states = buildArrayParam(state);
  const cities = buildArrayParam(city);
  const doctorIDs = buildArrayParam(doctorID);

  try {
    let query = `
      SELECT d.doctorID, d.firstName, d.lastName, d.gender,
             s.specialtyName, o.officeName,
             a.addrStreet, a.addrzip, a.addrcity, a.addrstate
      FROM doctor d
      LEFT JOIN Specialty s ON d.specialtyID = s.specialtyID
      LEFT JOIN office o ON d.officeID = o.officeID
      LEFT JOIN address a ON o.addressID = a.addressID
      WHERE 1=1
    `;

    const params = [];

    if (officeIDs.length > 0) {
      query += ` AND d.officeID IN (${officeIDs.map(() => '?').join(',')})`;
      params.push(...officeIDs);
    }

    if (specialtyIDs.length > 0) {
      query += ` AND d.specialtyID IN (${specialtyIDs.map(() => '?').join(',')})`;
      params.push(...specialtyIDs);
    }

    if (genders.length > 0) {
      query += ` AND d.gender IN (${genders.map(() => '?').join(',')})`;
      params.push(...genders);
    }

    if (states.length > 0) {
      query += ` AND a.addrstate IN (${states.map(() => '?').join(',')})`;
      params.push(...states);
    }

    if (cities.length > 0) {
      query += ` AND a.addrcity IN (${cities.map(() => '?').join(',')})`;
      params.push(...cities);
    }

    if (doctorIDs.length > 0) {
      query += ` AND d.doctorID IN (${doctorIDs.map(() => '?').join(',')})`;
      params.push(...doctorIDs);
    }

    // If startDate or endDate is provided, filter appointments and prescriptions
    let dateFilterAppointments = '';
    let dateFilterPrescriptions = '';
    const dateParams = [];

    if (startDate) {
      dateFilterAppointments += ' AND a.appointmentDateTime >= ?';
      dateFilterPrescriptions += ' AND pr.dateIssued >= ?';
      dateParams.push(startDate);
    }

    if (endDate) {
      dateFilterAppointments += ' AND a.appointmentDateTime <= ?';
      dateFilterPrescriptions += ' AND pr.dateIssued <= ?';
      dateParams.push(endDate);
    }

    const [doctors] = await pool.query(query, params);

    // Fetch appointments and prescriptions for each doctor
    const detailedData = await Promise.all(
      doctors.map(async (doctor) => {
        // Fetch appointments
        let appointmentQuery = `
          SELECT
            a.appointmentID,
            a.appointmentDateTime,
            a.reason,
            a.status,
            p.patientID,
            p.firstName AS patientFirstName,
            p.lastName AS patientLastName
          FROM appointment a
          INNER JOIN patient p ON a.patientID = p.patientID
          WHERE a.doctorID = ?
          ${dateFilterAppointments}
        `;
        const appointmentParams = [doctor.doctorID, ...dateParams];

        const [appointments] = await pool.query(appointmentQuery, appointmentParams);

        // Fetch prescriptions
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
          ${dateFilterPrescriptions}
        `;
        const prescriptionParams = [doctor.doctorID, ...dateParams];

        const [prescriptions] = await pool.query(prescriptionQuery, prescriptionParams);

        return {
          ...doctor,
          appointments,
          prescriptions,
        };
      })
    );

    res.json(detailedData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Error generating report');
  }
};