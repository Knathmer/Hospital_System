import { query } from "../../database.js";

export const getFinancialOverview = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      doctorID,
      officeID,
      serviceID,
      paymentStatus,
      patientName,
    } = req.query;

    let sql = `
      SELECT 
        appointment.appointmentID, 
        appointment.appointmentDateTime, 
        CONCAT(patient.firstName, ' ', patient.lastName) AS patientName, 
        CONCAT(doctor.firstName, ' ', doctor.lastName) AS doctorName, 
        service.serviceName, 
        service.price AS servicePrice, 
        office.officeName, 
        bill.amount AS totalBillAmount, 
        bill.insuranceCoveredAmount, 
        bill.paidAmount, 
        bill.paidStatus, 
        (
          SELECT 
            GROUP_CONCAT(CONCAT(additional_charge_type.name, ' ($', bill_additional_charge.amount, ')') SEPARATOR ', ') 
          FROM 
            bill_additional_charge 
            INNER JOIN additional_charge_type ON bill_additional_charge.additionalChargeTypeID = additional_charge_type.additionalChargeTypeID 
          WHERE 
            bill_additional_charge.billID = bill.billID
        ) AS additionalCharges, 
        (
          SELECT 
            GROUP_CONCAT(CONCAT(description, ' ($', amount, ')') SEPARATOR ', ') 
          FROM 
            custom_charge 
          WHERE 
            custom_charge.billID = bill.billID
        ) AS customCharges 
      FROM 
        appointment 
        LEFT JOIN patient ON appointment.patientID = patient.patientID 
        LEFT JOIN doctor ON appointment.doctorID = doctor.doctorID 
        LEFT JOIN service ON appointment.serviceID = service.serviceID 
        LEFT JOIN office ON appointment.officeID = office.officeID 
        INNER JOIN bill ON appointment.appointmentID = bill.appointmentID 
      WHERE 
        appointment.status = 'Completed'
    `;

    const queryParams = [];

    // Date Filters
    if (startDate) {
      sql += " AND DATE(appointment.appointmentDateTime) >= ?";
      queryParams.push(startDate);
    }

    if (endDate) {
      sql += " AND DATE(appointment.appointmentDateTime) <= ?";
      queryParams.push(endDate);
    }

    // Other Filters
    if (doctorID) {
      sql += " AND doctor.doctorID = ?";
      queryParams.push(doctorID);
    }

    if (officeID) {
      sql += " AND office.officeID = ?";
      queryParams.push(officeID);
    }

    if (serviceID) {
      sql += " AND service.serviceID = ?";
      queryParams.push(serviceID);
    }

    if (paymentStatus) {
      sql += " AND bill.paidStatus = ?";
      queryParams.push(paymentStatus);
    }

    if (patientName) {
      sql += ' AND CONCAT(patient.firstName, " ", patient.lastName) LIKE ?';
      queryParams.push(`%${patientName}%`);
    }

    // Fetch detailed data
    const rows = await query(sql, queryParams);

    // Fetch revenue by service
    let revenueByServiceSql = `
      SELECT 
        service.serviceName, 
        SUM(bill.paidAmount) AS totalRevenue
      FROM 
        appointment
        INNER JOIN service ON appointment.serviceID = service.serviceID
        INNER JOIN bill ON appointment.appointmentID = bill.appointmentID
      WHERE 
        appointment.status = 'Completed'
    `;
    const revenueByServiceParams = [];

    // Apply same filters to revenue by service
    if (startDate) {
      revenueByServiceSql += " AND DATE(appointment.appointmentDateTime) >= ?";
      revenueByServiceParams.push(startDate);
    }

    if (endDate) {
      revenueByServiceSql += " AND DATE(appointment.appointmentDateTime) <= ?";
      revenueByServiceParams.push(endDate);
    }

    if (doctorID) {
      revenueByServiceSql += " AND appointment.doctorID = ?";
      revenueByServiceParams.push(doctorID);
    }

    if (officeID) {
      revenueByServiceSql += " AND appointment.officeID = ?";
      revenueByServiceParams.push(officeID);
    }

    revenueByServiceSql += " GROUP BY service.serviceName";

    const revenueByService = await query(
      revenueByServiceSql,
      revenueByServiceParams
    );

    // Fetch monthly revenue
    let monthlyRevenueSql = `
      SELECT 
        DATE_FORMAT(appointment.appointmentDateTime, '%Y-%m') AS month, 
        SUM(bill.paidAmount) AS totalRevenue
      FROM 
        appointment
        INNER JOIN bill ON appointment.appointmentID = bill.appointmentID
      WHERE 
        appointment.status = 'Completed'
    `;
    const monthlyRevenueParams = [];

    if (startDate) {
      monthlyRevenueSql += " AND DATE(appointment.appointmentDateTime) >= ?";
      monthlyRevenueParams.push(startDate);
    }

    if (endDate) {
      monthlyRevenueSql += " AND DATE(appointment.appointmentDateTime) <= ?";
      monthlyRevenueParams.push(endDate);
    }

    monthlyRevenueSql += " GROUP BY month ORDER BY month";

    const monthlyRevenue = await query(monthlyRevenueSql, monthlyRevenueParams);

    res.json({ rows, revenueByService, monthlyRevenue });
  } catch (error) {
    console.error("Error fetching financial overview:", error);
    res.status(500).json({
      error: "An error occurred while fetching the financial overview.",
    });
  }
};

// Get Doctors
export const getDoctors = async (req, res) => {
  try {
    const sql = "SELECT doctorID, firstName, lastName FROM doctor";
    const doctors = await query(sql);

    res.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching doctors." });
  }
};

// Get Offices
export const getOffices = async (req, res) => {
  try {
    const sql = "SELECT officeID, officeName FROM office";
    const offices = await query(sql);

    res.json({ offices });
  } catch (error) {
    console.error("Error fetching offices:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching offices." });
  }
};

// Get Services
export const getServices = async (req, res) => {
  try {
    const sql = "SELECT serviceID, serviceName FROM service";
    const services = await query(sql);

    res.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching services." });
  }
};
