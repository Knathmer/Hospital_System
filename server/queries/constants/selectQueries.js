export const SELECT_PATIENT_FROM_EMAIL_QUERY =
  "SELECT * FROM patient WHERE email = ?";

export const SELECT_DOCTOR_FROM_EMAIL_QUERY =
  "SELECT * FROM doctor WHERE workEmail = ?";

export const SELECT_ADMIN_FROM_EMAIL_QUERY =
  "SELECT * FROM admin WHERE workEmail = ?";

export const SELECT_ADDRESSID_QUERY = `
            SELECT addressID
            FROM address
            WHERE addrStreet = ? AND addrZip = ? AND addrCity = ? AND addrState = ?`;

//Patient Medication Queries
export const SELECT_PATIENT_MEDICATION_INFORMATION_QUERY = `SELECT
    p.prescriptionID, p.medicationName, p.dosage, p.frequency, p.start,
    p.quantity, p.daySupply, p.instruction, p.refillCount, p.refillsRemaining,
    d.lastName, d.firstName,
    ph.pharmacyName, ph.address, ph.city, ph.state, ph.zipCode, ph.phoneNumber
FROM
    prescription AS p
JOIN
    patient AS q ON p.patientID = q.patientID
JOIN
    doctor AS d ON p.doctorID = d.doctorID
LEFT JOIN
    pharmacy AS ph ON p.pharmacyID = ph.pharmacyID
WHERE
    p.patientID = ?;
`;

export const SELECT_PATIENT_PHARMACY_INFORMATION_QUERY = `
                                                            SELECT
                                                              p.pharmacyName,
                                                              p.address,
                                                              p.city,
                                                              p.state,
                                                              p.zipCode,
                                                              p.phoneNumber,
                                                              p.pharmacyID
                                                            FROM
                                                              pharmacy AS p
                                                            JOIN
                                                              patient_pharmacy AS pp ON p.pharmacyID = pp.pharmacyID
                                                            WHERE
                                                              pp.patientID = ?;
                                                            `;

export const SELECT_PHARMACY_CHECK_EXISTS_ALREADY = `
                                                            SELECT * FROM pharmacy
                                                            WHERE pharmacyName = ? AND address = ? AND city = ? AND state = ? AND zipCode = ? AND phoneNumber = ?;
                                                          `;

export const GET_REFILL_HISTORY = `SELECT r.refillID, pr.medicationName, r.status, r.requestDate, d.firstName, d.lastName, r.notes
                                   FROM refill AS r
                                   JOIN prescription pr ON r.prescriptionID = pr.prescriptionID
                                   JOIN doctor d ON r.doctorID = d.doctorID
                                   WHERE r.patientID = ?
                                   ORDER BY r.requestDate DESC;`;


export const GET_PENDING_REQUESTS = `SELECT r.refillID, pr.medicationName, r.status, r.requestDate FROM refill AS r JOIN prescription AS pr ON r.prescriptionID = pr.prescriptionID WHERE r.patientID = ? AND r.status = 'Pending' ORDER BY r.requestDate DESC;`;

// User Role's Names
export const SELECT_PATIENT_NAMES =
  "SELECT firstName, lastName FROM patient WHERE patientID = ?";

export const SELECT_DOCTOR_NAMES = 
 "SELECT firstName, lastName FROM doctor WHERE doctorID = ?";

 export const SELECT_ADMIN_NAMES =
  "SELECT firstName, lastName from admin WHERE adminID = ?";

// Patient Dashboard (DB) Queries 
export const SELECT_UPCOMING_APPOINTMENTS_DB = `
  SELECT 
      a.appointmentDateTime, a.status, d.firstName AS doctorFirstName, d.lastName AS doctorLastName
  FROM 
      appointment AS a
  JOIN 
      doctor AS d ON a.doctorID = d.doctorID
  WHERE 
      a.patientID = ? 
  AND 
      a.appointmentDateTime > NOW()
  ORDER BY 
      a.appointmentDateTime ASC;
`;

export const SELECT_RECENT_MED_REQ_DB = 
`SELECT status, requestDate, FROM refill WHERE patientID = ?`;

export const SELECT_NOTIFICATIONS_DB = `
  SELECT 
      e.subject
  FROM 
      email_queue AS e
  WHERE 
      e.patientID = ?
  ORDER BY 
      e.createdAt DESC
  LIMIT 5;
`;

