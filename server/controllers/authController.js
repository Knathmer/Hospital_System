import { query } from '../database.js';  // Import the query function

async function getAddressID(addrStreet, addrZip, addrCity, addrState){
    try{
        const checkAddressSQL = `
            SELECT addressID
            FROM address
            WHERE addrStreet = ? AND addrZip = ? AND addrCity = ? AND addrState =?;
        `;
        const addresses = await query(checkAddressSQL, [addrStreet, addrZip, addrCity, addrState]);

        if (addresses.length > 0){
            return addresses[0].addressID;
        } else {
            // Handle address insertion here
            const insertAddressSQL = `
            INSERT INTO address (addrStreet, addrZip, addrCity, addrState)
            VALUES (?,?,?,?);
        `;
        const insertResult = await query(insertAddressSQL, [addrStreet, addrZip, addrCity, addrState]); // Insert using above query

        return insertResult.insertId; // MySQL returns the auto-increment ID this way.
        }
    }
    catch(error){
        console.error('Error checking and or inserting address.', error);
        throw new Error('Database error');
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Query the database to find the user by email
        const sql = 'SELECT * FROM patient WHERE email = ?';
        const users = await query(sql, [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // For now, just compare the plain text password
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function register(req, res) {
    const { confirmPassword, ...userData } = req.body;

    try {
        const checkEmailSQL = 'SELECT * FROM patient WHERE email = ?';
        const existingUsers = await query(checkEmailSQL, [userData.email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        const checkPhoneSQL = 'SELECT * FROM patient WHERE phoneNumber = ?';
        const existingPhoneUsers = await query(checkPhoneSQL, [userData.phoneNumber]);

        if (existingPhoneUsers.length > 0) {
            return res.status(400).json({ message: 'Phone number already exists!' });
        }

        const addressID = await getAddressID(userData.addrStreet, userData.addrZip, userData.addrCity, userData.addrState);

        const insertPatientSQL = `
            INSERT INTO patient 
            (firstName, lastName, dateOfBirth, gender, height, weight, phoneNumber, email, password, lastLogin, emergencyPhoneNumber, emergencyEmail, createdBy, createdAt, updatedBy, updatedAt, addressID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        await query(insertPatientSQL, [
            userData.firstName,
            userData.lastName,
            userData.dateOfBirth,
            userData.gender,
            userData.height,
            userData.weight,
            userData.phoneNumber,
            userData.email,
            userData.password,
            new Date(),  // lastLogin 
            userData.emergencyPhoneNumber,
            userData.emergencyEmail,
            'user', 
            new Date(), // Needs to be set
            'user',
            new Date(), // Needs to be set
            addressID 
        ]);

        return res.status(200).json({ message: 'Registration Successful!' });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
