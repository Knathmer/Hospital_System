import { query } from "../database.js"; // Import query function
import pool from "../database.js"; // Import pool for transactions

// Function to get unique states tied to offices
export async function getStates(req, res) {
  try {
    const statesData = await query(
      `SELECT DISTINCT a.addrstate AS state
       FROM office o
       JOIN address a ON o.addressID = a.addressID
       ORDER BY a.addrstate`
    );
    const states = statesData.map(item => item.state);
    res.json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ error: "Error fetching states" });
  }
}

// Function to get unique cities based on state
export async function getCities(req, res) {
  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ error: "State parameter is required" });
  }

  try {
    const citiesData = await query(
      `SELECT DISTINCT a.addrcity AS city
       FROM office o
       JOIN address a ON o.addressID = a.addressID
       WHERE a.addrstate = ?
       ORDER BY a.addrcity`,
      [state]
    );
    const cities = citiesData.map(item => item.city);
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Error fetching cities" });
  }
}

// Function to get offices based on state and city
export async function getOffices(req, res) {
  const { state, city } = req.query;

  if (!state || !city) {
    return res.status(400).json({ error: "State and city parameters are required" });
  }

  try {
    const officesData = await query(
      `SELECT o.officeID, o.officeName, CONCAT(a.addrStreet, ', ', a.addrcity, ', ', a.addrstate, ' ', a.addrzip) AS address
       FROM office o
       JOIN address a ON o.addressID = a.addressID
       WHERE a.addrstate = ? AND a.addrcity = ?
       ORDER BY o.officeName`,
      [state, city]
    );
    res.json(officesData);
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).json({ error: "Error fetching offices" });
  }
}


export async function getPatientAppointments(req, res) {
  const patientID = req.user.patientID; // Get patientID from the verified JWT

  if (!patientID) {
    return res.status(401).json({ error: "Patient must be logged in" });
  }

  try {
    const appointments = await query(
      `SELECT 
          a.appointmentID, 
          a.appointmentDateTime, 
          a.reason, 
          a.status, 
          a.visitType, 
          s.serviceName AS service,
          d.firstName AS doctorFirstName, 
          d.lastName AS doctorLastName,
          d.workEmail AS doctorEmail,       -- Updated
          d.workPhoneNumber AS doctorPhone, -- Updated
          o.officeName AS officeName,
          CONCAT(addr.addrStreet, ', ', addr.addrcity, ', ', addr.addrstate, ' ', addr.addrzip) AS officeAddress
        FROM appointment a
        LEFT JOIN doctor d ON a.doctorID = d.doctorID
        LEFT JOIN office o ON a.officeID = o.officeID
        LEFT JOIN address addr ON o.addressID = addr.addressID
        LEFT JOIN service s ON a.serviceID = s.serviceID
        WHERE a.patientID = ?
        ORDER BY a.appointmentDateTime DESC`,
      [patientID]
    );

    // Categorize appointments
    const categorizedAppointments = {
      upcoming: [],
      requested: [],
      past: [],
      other: []
    };

    const now = new Date();

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDateTime);
      switch (appointment.status) {
        case 'Scheduled':
          if (appointmentDate >= now) {
            categorizedAppointments.upcoming.push(appointment);
          } else {
            categorizedAppointments.past.push(appointment);
          }
          break;
        case 'Requested':
          categorizedAppointments.requested.push(appointment);
          break;
        case 'Completed':
        case 'Missed':
          categorizedAppointments.past.push(appointment);
          break;
        case 'Cancelled':
        case 'Request Denied':
          categorizedAppointments.other.push(appointment);
          break;
        default:
          categorizedAppointments.other.push(appointment);
      }
    });

    res.json(categorizedAppointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
}

// Function to get specialties
export async function getSpecialties(req, res) {
  try {
    // Query the database to get unique specialties from the doctor table
    const specialties = await query("SELECT * FROM specialty;");

    res.json(specialties);
  } catch (error) {
    console.error("Error retrieving specialties:", error);
    res.status(500).json({ error: "Error retrieving specialties" });
  }
}

export const getServices = async (req, res) => {
  try {
    const { specialtyID } = req.query;

    let services;
    if (specialtyID) {
      // Fetch services for the specified specialty
      services = await query(
        `SELECT service.serviceID, service.serviceName, service.price
           FROM service
           JOIN specialty_service ss ON service.serviceID = ss.serviceID
           WHERE ss.specialtyID = ?`,
        [specialtyID]
      );
    } else {
      // Fetch all services
      services = await query(
        `SELECT service.serviceID, service.serviceName, service.price
           FROM service`
      );
    }

    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Error fetching services" });
  }
};

export async function getDoctorsBySpecialty(req, res) {
  const { specialtyID, gender, state, city, officeID, serviceID } = req.query;

  try {
    let queryStr = `
      SELECT DISTINCT
        doctor.doctorID,
        doctor.firstName,
        doctor.lastName,
        doctor.gender,
        doctor.workPhoneNumber,
        doctor.workEmail,
        s.specialtyName,
        doctor.officeID,
        office.officeName AS officeLocation,
        CONCAT(a.addrStreet, ', ', a.addrcity, ', ', a.addrstate, ' ', a.addrzip) AS officeAddress
      FROM doctor
      LEFT JOIN office ON doctor.officeID = office.officeID
      INNER JOIN specialty s ON doctor.specialtyID = s.specialtyID
      JOIN address a ON office.addressID = a.addressID
      LEFT JOIN specialty_service ss ON s.specialtyID = ss.specialtyID
      LEFT JOIN service ON ss.serviceID = service.serviceID
      WHERE 1=1 AND doctor.inactive = 0
    `;
    const params = [];

    if (specialtyID) {
      queryStr += " AND s.specialtyID = ?";
      params.push(specialtyID);
    }

    if (gender) {
      queryStr += " AND doctor.gender = ?";
      params.push(gender);
    }

    if (state) {
      queryStr += " AND a.addrstate = ?";
      params.push(state);
    }

    if (city) {
      queryStr += " AND a.addrcity = ?";
      params.push(city);
    }

    if (officeID) {
      queryStr += " AND office.officeID = ?";
      params.push(officeID);
    }

    if (serviceID) {
      queryStr += " AND service.serviceID = ?";
      params.push(serviceID);
    }

    queryStr += " ORDER BY s.specialtyName, doctor.lastName";

    const doctors = await query(queryStr, params);
    res.json(doctors);
  } catch (error) {
    console.error("Error retrieving doctors:", error);
    res.status(500).json({ error: "Error retrieving doctors" });
  }
}

// Function to book an appointment
export async function bookAppointment(req, res) {
  const { appointmentDateTime, reason, doctorID, serviceID, visitType } = req.body;
  const patientID = req.user.patientID; // Get the patientID from the verified JWT

  // Validation Checks
  if (!patientID) {
    return res
      .status(401)
      .json({ message: "Patient must be logged in to book an appointment" });
  }

  if (!serviceID) {
    return res.status(400).json({ message: "Service ID is required" });
  }

  if (!visitType) {
    return res.status(400).json({ message: "Visit Type is required" });
  }

  // Validate visitType against allowed enum values
  const allowedVisitTypes = [
    'Telemedicine (Video)',
    'Over-the-Phone',
    'In-Person',
    'Home Visit'
  ];

  if (!allowedVisitTypes.includes(visitType)) {
    return res.status(400).json({ message: "Invalid Visit Type selected" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if the appointment time is already booked for the same doctor
    const [existingAppointments] = await connection.query(
      "SELECT * FROM appointment WHERE doctorID = ? AND appointmentDateTime = ? AND status IN ('Requested', 'Scheduled', 'Completed')",
      [doctorID, appointmentDateTime]
    );

    if (existingAppointments.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    // Retrieve the officeID associated with the doctor
    const [doctorRows] = await connection.query(
      "SELECT officeID FROM doctor WHERE doctorID = ?",
      [doctorID]
    );

    if (doctorRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Doctor not found" });
    }

    const officeID = doctorRows[0].officeID;

    // Ensure the doctor has an associated office
    if (!officeID) {
      await connection.rollback();
      return res.status(400).json({ message: "Doctor does not have an associated office" });
    }

    // Book the appointment with officeID
    await connection.query(
      `INSERT INTO appointment 
          (appointmentDateTime, reason, status, patientID, doctorID, officeID, serviceID, visitType)
          VALUES (?, ?, 'Requested', ?, ?, ?, ?, ?)`,
      [appointmentDateTime, reason, patientID, doctorID, officeID, serviceID, visitType]
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
}


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
    const bookedTimes = appointments.map((app) => {
      const dateObj = new Date(app.appointmentDateTime);
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
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
        patient.email as patientEmail,
        service.serviceName
      FROM appointment
      JOIN patient ON appointment.patientID = patient.patientID
      LEFT JOIN service ON appointment.serviceID = service.serviceID
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

  const { appointmentID, status } = req.body;

  try {
    const result = await query(
      `UPDATE appointment SET status = ? WHERE appointmentID = ? AND doctorID = ?`,
      [status, appointmentID, doctorID]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Appointment updated successfully" });
    } else {
      res
        .status(404)
        .json({ error: "Appointment not found or not authorized" });
    }
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Error updating appointment" });
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
