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
    p.quantity, p.daySupply, p.instruction, p.refillCount, p.refillsRemaining, p.active,
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

export const SELECT_RECENT_MED_REQ_DB = `SELECT status, requestDate FROM refill WHERE patientID = ?`;

export const SELECT_BILLING_DB = `SELECT dueDate, paidStatus FROM bill WHERE patientID = ?`;

// Admin Dashboard DB Queries
export const SELECT_TOTAL_DOC = 'SELECT COUNT(*) AS totalDoctors FROM doctor';
export const SELECT_TOTAL_PATIENT = 'SELECT COUNT(*) as totalPatient FROM patient';
export const SELECT_TOTAL_ADMIN = 'SELECT COUNT(*) as totalAdmin from admin';
export const SELECT_TOTAL_APPOINTMENT = 'SELECT COUNT(*) AS totalAppointments FROM appointment';
export const SELECT_UPCOMING_APPOINTMENTS_ADMIN = `
  SELECT 
      a.appointmentDateTime, 
      d.firstName AS doctorFirstName, 
      d.lastName AS doctorLastName, 
      p.firstName AS patientFirstName, 
      p.lastName AS patientLastName
  FROM 
      appointment AS a
  JOIN 
      doctor AS d ON a.doctorID = d.doctorID
  JOIN 
      patient AS p ON a.patientID = p.patientID
  WHERE 
      a.appointmentDateTime > NOW()
  ORDER BY 
      a.appointmentDateTime ASC;
`;
export const SELECT_DOCTORS_WITH_SPECIALTY = `
  SELECT 
      d.firstName, 
      d.lastName, 
      s.specialtyName 
  FROM 
      doctor AS d
  JOIN 
      specialty AS s 
  ON 
      d.specialtyID = s.specialtyID;
`;


export const GET_CURRENT_PAST_BALANCE = `SELECT IFNULL(SUM(CASE WHEN paidStatus != 'Paid' THEN amount - paidAmount ELSE 0 END), 0) AS currentBalance, 
                                        IFNULL(SUM(CASE WHEN dueDate < CURDATE() AND paidStatus = 'Overdue' THEN amount - paidAmount ELSE 0 END), 0) AS pastDueBalance
                                        FROM bill 
                                        WHERE patientID = ?;
`;

export const GET_LAST_PAYMENT_INFORMATION = `SELECT p.amount AS lastPaymentAmount, p.paymentDate AS lastPaymentDate 
                                            FROM bill b LEFT JOIN payment p ON p.billID = b.billID 
                                            WHERE b.patientID = ? 
                                            ORDER BY p.paymentDate DESC LIMIT 1;`;

export const GET_PATIENT_INFORMATION = `SELECT p.firstName, p.lastName, p.dateOfBirth, p.phoneNumber, p.email, 
                                        a.addrStreet, a.addrcity, a.addrState, a.addrZip FROM patient AS p 
                                        JOIN address AS a ON p.addressID = a.addressID WHERE p.patientID = ?;`;

export const GET_OFFICE_INFORMATION = `SELECT o.officeName, o.officePhoneNumber, o.officeEmail, a.addrStreet, 
                                      a.addrcity, a.addrState, a.addrZip
                                      FROM office AS o
                                      JOIN address AS a ON o.addressID = a.addressID
                                      JOIN bill AS b ON o.officeID = b.officeID
                                      WHERE b.patientID = ?;`;

export const GET_RECENT_PAYMENTS = `SELECT p.paymentID, p.paymentDate, p.amount
                                    FROM payment AS p
                                    JOIN bill AS b ON p.billID = b.billID
                                    WHERE b.patientID = ?
                                    ORDER BY p.paymentDate DESC
                                    LIMIT 5;`;

export const GET_DETAILS_YTD = `SELECT b.billID, a.appointmentDateTime AS visitDate, COALESCE(vt.visitTypeName, 'N/A') AS visitType, s.serviceName AS serviceName, COALESCE(d.firstName, 'N/A') AS doctorFirstName, COALESCE(d.lastName, '') AS doctorLastName, p.firstName AS patientFirstName, p.lastName AS patientLastName, COALESCE(i.providerName, 'N/A') AS insuranceName, b.amount AS billedAmount, b.paidAmount, b.insuranceCoveredAmount, (b.amount - b.paidAmount) AS balance, b.paidStatus, b.dueDate FROM bill b INNER JOIN appointment a ON b.appointmentID = a.appointmentID INNER JOIN patient p ON a.patientID = p.patientID INNER JOIN service s ON b.serviceID = s.serviceID LEFT JOIN doctor d ON a.doctorID = d.doctorID LEFT JOIN insurance i ON b.insuranceID = i.insuranceID LEFT JOIN visit_type vt ON a.visitTypeID = vt.visitTypeID WHERE b.patientID = ? AND DATE(a.appointmentDateTime) BETWEEN ? AND ? ORDER BY a.appointmentDateTime DESC;
`;

export const GET_PAYMENTS_STATEMENTS = `SELECT p.paymentDate, p.amount, p.payerType, p.paymentID FROM payment AS p JOIN bill AS b ON p.billID = b.billID WHERE b.patientID = ? AND DATE(p.paymentDate) BETWEEN ? AND ? ORDER BY p.paymentDate DESC;`;


export const GET_OUTSTANDING_BILLS = `SELECT b.billID, b.dueDate, (b.amount - b.paidAmount) AS outstandingBalance, s.serviceName, o.officeName FROM bill AS b INNER JOIN service s ON b.serviceID = s.serviceID INNER JOIN office o ON b.officeID = o.officeID WHERE b.patientID = ? AND b.paidStatus <> 'Paid';`;

export const GET_DOCTOR_SCHEDULE = `SELECT p.patientID, CONCAT(p.firstName, ' ', p.lastName) AS fullName, a.appointmentDateTime, a.appointmentID,  s.serviceName,  s.serviceID FROM patient p JOIN appointment a ON p.patientID = a.patientID JOIN service s ON a.serviceID = s.serviceID WHERE a.doctorID = ? AND a.appointmentDateTime >= ? AND a.appointmentDateTime < ? AND a.status = 'Scheduled';`;

export const GET_PATIENT_INFO_DOC_APPT = `SELECT p.patientID, CONCAT(p.firstName, ' ', p.lastName) AS patientFullName, p.dateOfBirth, p.phoneNumber, p.email FROM patient p INNER JOIN appointment a ON p.patientID = a.patientID WHERE a.appointmentID = ? AND a.doctorID = ?;`;

export const GET_PATIENT_INSURANCE_DOC_APPT = `SELECT i.insuranceID, i.providerName, i.policy_number, i.coverageDetails, i.coverage_expiration_date FROM insurance i INNER JOIN patient p ON i.patientID = p.patientID WHERE p.patientID = ?;`;

export const GET_PATIENT_ALLERGIES = `SELECT a.allergyID, a.allergen, a.severity, a.reaction FROM allergy a INNER JOIN patient p ON a.patientID = p.patientID WHERE p.patientID = ?;`;

export const GET_PATIENT_SURGERIES = `SELECT s.surgeryID, s.surgeryType, s.surgeryDateTime, CONCAT(d.firstName, ' ' , d.lastName) AS doctorFullName, sp.specialtyName , o.officeName FROM surgery s LEFT JOIN doctor d ON s.doctorID = d.doctorID LEFT JOIN specialty sp ON d.specialtyID = sp.specialtyID INNER JOIN office o ON d.officeID = o.officeID INNER JOIN patient p ON s.patientID = p.patientID WHERE p.patientID = ?;`;

export const GET_PATIENT_DISABILITIES = `SELECT d.disabilityID, d.disabilityType, d.notes FROM disability d WHERE d.patientID = ?;`;

export const GET_PATIENT_VACCINE = `SELECT v.vaccineID, v.vaccineName, v.dateAdministered AS date, CONCAT(d.firstName, ' ', d.lastName) AS doctorFullName, o.officeName FROM vaccine v LEFT JOIN doctor d ON v.doctorID = d.doctorID INNER JOIN office o ON d.officeID = o.officeID INNER JOIN patient p ON v.patientID = p.patientID WHERE p.patientID = ?;`;

export const GET_PATIENT_FAMILY_HISTORY =
  "SELECT fh.`condition`, fh.familyHistoryID, fh.notes FROM family_history fh INNER JOIN patient p ON fh.patientID = p.patientID WHERE p.patientID = ?;";

export const GET_PATIENT_APPOINTMENT_INFO = `SELECT a.appointmentDateTime, a.reason, o.officeName, o.officeID, s.serviceName, s.serviceID, s.price,d.specialtyID FROM appointment a INNER JOIN office o ON a.officeID = o.officeID INNER JOIN service s ON a.serviceID = s.serviceID INNER JOIN patient p ON a.patientID = p.patientID INNER JOIN doctor d ON a.doctorID = d.doctorID WHERE a.appointmentID = ? AND p.patientID = ? AND d.doctorID = ?;`;

export const GET_PREVIOUS_APPOINTMENTS = `SELECT a.appointmentID, vn.notes, a.appointmentDateTime AS date, s.serviceName, CONCAT(d.firstName, ' ', d.lastName) AS doctorFullName, sp.specialtyName, o.officeName, CONCAT(addr.addrStreet, ' ', addr.addrcity, ' ', addr.addrstate, ' ', addr.addrzip) AS officeAddress FROM appointment a INNER JOIN service s ON a.serviceID = s.serviceID INNER JOIN doctor d ON a.doctorID = d.doctorID INNER JOIN specialty sp ON d.specialtyID = sp.specialtyID INNER JOIN office o ON a.officeID = o.officeID INNER JOIN address addr ON o.addressID = addr.addressID INNER JOIN patient p ON a.patientID = p.patientID INNER JOIN visit_notes vn ON a.appointmentID = vn.appointmentID WHERE p.patientID = ? AND a.status = 'Completed' ORDER BY a.appointmentDateTime DESC LIMIT 5;`;

export const GET_ADDITIONAL_CHARGES = `SELECT ac.additionalChargeTypeID AS ACTID, ac.name, ac.description, ac.price FROM additional_charge_type ac INNER JOIN specialty_additional_charge sac ON ac.additionalChargeTypeID = sac.additionalChargeTypeID WHERE sac.specialtyID = ?;`;
