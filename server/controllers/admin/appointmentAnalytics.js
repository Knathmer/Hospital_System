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
    const statuses = parseArray(req.query.statuses);
    const visitTypes = parseArray(req.query.visitTypes);
    const specialtyIDs = parseArray(req.query.specialtyIDs);
    const serviceIDs = parseArray(req.query.serviceIDs);

    // Build the SQL query dynamically based on provided filters
    let sql = `
      SELECT 
        a.appointmentID,
        a.appointmentDateTime,
        a.status,
        a.visitType,
        s.serviceID,
        s.serviceName,
        s.price,
        p.patientID,
        p.firstName AS patientFirstName,
        p.lastName AS patientLastName,
        d.doctorID,
        d.firstName AS doctorFirstName,
        d.lastName AS doctorLastName,
        d.specialtyID,
        sp.specialtyName,
        o.officeID,
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

    if (statuses && statuses.length > 0) {
      const statusPlaceholders = statuses.map(() => '?').join(',');
      sql += ` AND a.status IN (${statusPlaceholders})`;
      params.push(...statuses);
    }

    if (visitTypes && visitTypes.length > 0) {
      const visitTypePlaceholders = visitTypes.map(() => '?').join(',');
      sql += ` AND a.visitType IN (${visitTypePlaceholders})`;
      params.push(...visitTypes);
    }

    if (specialtyIDs && specialtyIDs.length > 0) {
      const specialtyPlaceholders = specialtyIDs.map(() => '?').join(',');
      sql += ` AND sp.specialtyID IN (${specialtyPlaceholders})`;
      params.push(...specialtyIDs);
    }

    if (serviceIDs && serviceIDs.length > 0) {
      const servicePlaceholders = serviceIDs.map(() => '?').join(',');
      sql += ` AND s.serviceID IN (${servicePlaceholders})`;
      params.push(...serviceIDs);
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
    const stateCounts = {};
    const cityCounts = {};
    const officeCounts = {};
    const doctorCounts = {};
    const patientCounts = {};

    appointments.forEach(appointment => {
      // Count by status
      const status = appointment.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // Count by visitType
      const visitType = appointment.visitType || 'Unknown';
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

      // Count by state
      const state = appointment.state || 'Unknown State';
      stateCounts[state] = (stateCounts[state] || 0) + 1;

      // Count by city
      const city = appointment.city || 'Unknown City';
      cityCounts[city] = (cityCounts[city] || 0) + 1;

      // Count by office
      const office = appointment.officeName || 'Unknown Office';
      officeCounts[office] = (officeCounts[office] || 0) + 1;

      // Count by doctor
      const doctorName = `${appointment.doctorFirstName} ${appointment.doctorLastName}` || 'Unknown Doctor';
      doctorCounts[doctorName] = (doctorCounts[doctorName] || 0) + 1;

      // Count by patient
      const patientName = `${appointment.patientFirstName} ${appointment.patientLastName}` || 'Unknown Patient';
      patientCounts[patientName] = (patientCounts[patientName] || 0) + 1;
    });

    res.status(200).json({
      appointments,
      totalAppointments,
      statusCounts,
      visitTypeCounts,
      appointmentsByDate,
      specialtyCounts,
      serviceCounts,
      stateCounts,
      cityCounts,
      officeCounts,
      doctorCounts,
      patientCounts,
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

  // Function to get appointment statuses
export async function getAppointmentStatuses(req, res) {
  try {
    const result = await query(`SELECT DISTINCT status FROM appointment`);
    const statuses = result.map(row => row.status);
    res.status(200).json({ statuses });
  } catch (error) {
    console.error('Error fetching appointment statuses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to get visit types
export async function getVisitTypes(req, res) {
  try {
    const result = await query(`SELECT DISTINCT visitType FROM appointment`);
    const visitTypes = result.map(row => row.visitType);
    res.status(200).json({ visitTypes });
  } catch (error) {
    console.error('Error fetching visit types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to get specialties
export async function getSpecialties(req, res) {
  try {
    const specialties = await query('SELECT specialtyID, specialtyName FROM specialty');
    res.status(200).json({ specialties });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to get services
export async function getServices(req, res) {
  try {
    const services = await query('SELECT serviceID, serviceName FROM service');
    res.status(200).json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}