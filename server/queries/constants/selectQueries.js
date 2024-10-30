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
export const SELECT_PATIENT_MEDICATION_INFORMATION_QUERY = `SELECT p.medicationName, p.dosage, p.frequency, p.start,
                                                            p.quantity, p.daySupply, p.instruction, d.lastName, d.firstName,
                                                            ph.pharmacyName, ph.address, ph.city, ph.state, ph.zipCode, ph.phoneNumber
                                                            FROM prescription AS p
                                                            JOIN patient AS q ON p.patientID = q.patientID
                                                            JOIN doctor AS d ON p.doctorID = d.doctorID
                                                            JOIN pharmacy AS ph ON q.pharmacyID = ph.pharmacyID
                                                            WHERE p.patientID = ?`;

export const SELECT_PATIENT_NAMES =
"SELECT firstName, lastName FROM patient WHERE patientID = ?";