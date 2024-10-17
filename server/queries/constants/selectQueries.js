export const SELECT_PATIENT_FROM_EMAIL_QUERY =
  "SELECT * FROM patient WHERE email = ?";

export const SELECT_DOCTOR_FROM_EMAIL_QUERY =
  "SELECT * FROM doctor WHERE workEmail = ?";

export const SELECT_ADMIN_FROM_EMAIL_QUERY =
  "SELECT * FROM admin WHERE workEmail = ?";

export const SELECT_ADDRESSID_QUERY = `
            SELECT addressID
            FROM address
            WHERE addrStreet = ? AND addrZip = ? AND addrCity = ? AND addrState = ?;
        `;
