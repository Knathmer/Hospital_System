import { query } from '../database.js';  // Import the query function
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET; //Pulls the ENV secret key from .env

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

//Function to handle login request and JWT generation
export async function login(req, res) {
    const { email, password } = req.body; //Destructures the request into email and password (this matches what we gave it in the front-end)

    try {
        // Query the database to find the user by email in all tables (admin, patient, doctor)
        const checkAdminSQL = 'SELECT * FROM admin WHERE workEmail = ?';
        const checkPatientSQL = 'SELECT * FROM patient WHERE email = ?';
        const checkDoctorSQL = 'SELECT * FROM doctor WHERE workEmail = ?';

        let user = await query(checkAdminSQL, [email]); // 'let' allows variable to change within the same block where it was defined
        let role = 'admin';

        if (user.length === 0) { 
            user = await query(checkPatientSQL, [email]);
            role = 'patient';
        }

        if (user.length === 0) {
            user = await query(checkDoctorSQL, [email]);
            role = 'doctor';
        }

        if (user.length === 0) { //If we have cycled through all and have matched, then we say there is an invalid log in
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        user = user[0];

        // Generate a JWT token with the user's ID and role
        const token = jwt.sign(
            { id: user.id, role: role },  // Payload (user id and role)
            JWT_SECRET,                   // Secret
            { expiresIn: '1h' }           // Token expiration
        );

        // Return the token and user information
        return res.status(200).json({
            message: 'Login successful',
            token,                        // JWT Token
            user: { id: user.id, email: user.email, role }  // User info
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//Function to handle user registration
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
            (firstName, lastName, dateOfBirth, gender, height, weight,
            phoneNumber, email, password, lastLogin, emergencyPhoneNumber,
             emergencyEmail, createdBy, createdAt, updatedBy, updatedAt, addressID)
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
