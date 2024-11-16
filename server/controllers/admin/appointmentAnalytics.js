import { query } from "../../database.js";

export async function getAppointmentAnalytics(req, res) {
  try {
    const parseArray = (value) => {
      if (!value) return null;
      if (Array.isArray(value)) return value;
      return value.split(',');
    };

    const {
      startDate,
      endDate,
    } = req.query;

    const states = parseArray(req.query.states);
    const cities = parseArray(req.query.cities);
    const officeIDs = parseArray(req.query.officeIDs);
    const doctorIDs = parseArray(req.query.doctorIDs);
    const patientIDs = parseArray(req.query.patientIDs);

    // Build the SQL query dynamically based on provided filters
    let sql = `
      SELECT 
        a.appointmentID,
        a.appointmentDateTime,
        a.status,
        a.visitType,
        s.serviceName,
        s.price,
        p.firstName AS patientFirstName,
        p.lastName AS patientLastName,
        d.firstName AS doctorFirstName,
        d.lastName AS doctorLastName,
        d.specialtyID,
        sp.specialtyName,
        o.officeName,
        addr.addrstate AS state,
        addr.addrcity AS city
      FROM appointment a
      LEFT JOIN patient p ON a.patientID = p.patientID
      LEFT JOIN doctor d ON a.doctorID = d.doctorID
      LEFT JOIN specialty sp ON d.specialtyID = sp.specialtyID
      LEFT JOIN service s ON a.serviceID = s.serviceID
      LEFT JOIN office o ON a.officeID = o.officeID
      LEFT JOIN address addr ON o.addressID = addr.addressID
      WHERE 1=1
    `;

    const params = [];

    if (startDate && endDate) {
      sql += ' AND a.appointmentDateTime BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (states && states.length > 0) {
      const statePlaceholders = states.map(() => '?').join(',');
      sql += ` AND addr.addrstate IN (${statePlaceholders})`;
      params.push(...states);
    }

    if (cities && cities.length > 0) {
      const cityPlaceholders = cities.map(() => '?').join(',');
      sql += ` AND addr.addrcity IN (${cityPlaceholders})`;
      params.push(...cities);
    }

    if (officeIDs && officeIDs.length > 0) {
      const officePlaceholders = officeIDs.map(() => '?').join(',');
      sql += ` AND o.officeID IN (${officePlaceholders})`;
      params.push(...officeIDs);
    }

    if (doctorIDs && doctorIDs.length > 0) {
      const doctorPlaceholders = doctorIDs.map(() => '?').join(',');
      sql += ` AND d.doctorID IN (${doctorPlaceholders})`;
      params.push(...doctorIDs);
    }

    if (patientIDs && patientIDs.length > 0) {
      const patientPlaceholders = patientIDs.map(() => '?').join(',');
      sql += ` AND p.patientID IN (${patientPlaceholders})`;
      params.push(...patientIDs);
    }

    // Execute the query to get appointments
    const appointments = await query(sql, params);

    // Compute summary statistics
    const totalAppointments = appointments.length;
    const statusCounts = {};
    const visitTypeCounts = {};
    const appointmentsByDate = {};
    const specialtyCounts = {};
    const serviceCounts = {};

    appointments.forEach(appointment => {
      // Count by status
      const status = appointment.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // Count by visitType
      const visitType = appointment.visitType;
      visitTypeCounts[visitType] = (visitTypeCounts[visitType] || 0) + 1;

      // Count appointments by date
      const date = appointment.appointmentDateTime.toISOString().split('T')[0];
      appointmentsByDate[date] = (appointmentsByDate[date] || 0) + 1;

      // Count by specialty
      const specialty = appointment.specialtyName || 'Unknown Specialty';
      specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;

      // Count by service
      const service = appointment.serviceName || 'Unknown Service';
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });

    res.status(200).json({ 
      appointments, 
      totalAppointments, 
      statusCounts, 
      visitTypeCounts, 
      appointmentsByDate,
      specialtyCounts,
      serviceCounts
    });
  } catch (error) {
    console.error('Error fetching appointment analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
  
  export async function getStates(req, res) {
    try {
      const result = await query(`
        SELECT DISTINCT addr.addrstate AS state
        FROM address addr
        JOIN office o ON addr.addressID = o.addressID
      `);
      const states = result.map(row => row.state);
      res.status(200).json({ states });
    } catch (error) {
      console.error('Error fetching states:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  export async function getCities(req, res) {
    try {
      const result = await query(`
        SELECT DISTINCT addr.addrcity AS city
        FROM address addr
        JOIN office o ON addr.addressID = o.addressID
      `);
      const cities = result.map(row => row.city);
      res.status(200).json({ cities });
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  export async function getOffices(req, res) {
    try {
      const parseArray = (value) => {
        if (!value) return null;
        if (Array.isArray(value)) return value;
        return value.split(',');
      };
  
      const states = parseArray(req.query.states);
      const cities = parseArray(req.query.cities);
  
      let sql = `
        SELECT o.officeID, o.officeName
        FROM office o
        JOIN address addr ON o.addressID = addr.addressID
        WHERE 1=1
      `;
      const params = [];
  
      if (states && states.length > 0) {
        const statePlaceholders = states.map(() => '?').join(',');
        sql += ` AND addr.addrstate IN (${statePlaceholders})`;
        params.push(...states);
      }
  
      if (cities && cities.length > 0) {
        const cityPlaceholders = cities.map(() => '?').join(',');
        sql += ` AND addr.addrcity IN (${cityPlaceholders})`;
        params.push(...cities);
      }
  
      const offices = await query(sql, params);
      res.status(200).json({ offices });
    } catch (error) {
      console.error('Error fetching offices:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  export async function getDoctors(req, res) {
    try {
      const doctors = await query('SELECT doctorID, firstName, lastName FROM doctor');
      res.status(200).json({ doctors });
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  export async function getPatients(req, res) {
    try {
      const patients = await query('SELECT patientID, firstName, lastName FROM patient');
      res.status(200).json({ patients });
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }