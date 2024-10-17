export const INSERT_PATIENT_QUERY = `
            INSERT INTO patient 
            (firstName, lastName, dateOfBirth, gender, height, weight, phoneNumber, email, password, lastLogin, emergencyPhoneNumber,
             emergencyEmail, createdBy, createdAt, updatedBy, updatedAt, addressID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

export const INSERT_ADDRESS_QUERY = `
        INSERT INTO address (addrStreet, addrZip, addrCity, addrState)
        VALUES (?, ?, ?, ?);
    `;
