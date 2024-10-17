import { query } from "../database.js"; // Import the query function
import pool from "../database.js"; // You can also import the pool if needed for transactions
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET; //Pulls the ENV secret key from .env

// Helper function for getting or inserting an address
async function getAddressID(addrStreet, addrZip, addrCity, addrState) {
  try {
    const checkAddressSQL = `
            SELECT addressID
            FROM address
            WHERE addrStreet = ? AND addrZip = ? AND addrCity = ? AND addrState = ?;
        `;
    const addresses = await query(checkAddressSQL, [
      addrStreet,
      addrZip,
      addrCity,
      addrState,
    ]);

    if (addresses.length > 0) {
      return addresses[0].addressID;
    } else {
      // Handle address insertion here
      const insertAddressSQL = `
                INSERT INTO address (addrStreet, addrZip, addrCity, addrState)
                VALUES (?, ?, ?, ?);
            `;
      const insertResult = await query(insertAddressSQL, [
        addrStreet,
        addrZip,
        addrCity,
        addrState,
      ]);
      return insertResult.insertId; // MySQL returns the auto-increment ID this way.
    }
  } catch (error) {
    console.error("Error checking or inserting address:", error);
    throw new Error("Database error");
  }
}

// Function to handle login request and JWT generation
export async function login(req, res) {
  const { email, password } = req.body; // Destructures the request into email and password

  try {
    // Query the database to find the user by email in all tables (admin, patient, doctor)
    const checkAdminSQL = "SELECT * FROM admin WHERE workEmail = ?";
    const checkPatientSQL = "SELECT * FROM patient WHERE email = ?";
    const checkDoctorSQL = "SELECT * FROM doctor WHERE workEmail = ?";

    let user = await query(checkAdminSQL, [email]);
    let role = "admin";
    let userIDField = "adminID";

    if (user.length === 0) {
      user = await query(checkPatientSQL, [email]);
      role = "patient";
      userIDField = "patientID";
    }

    if (user.length === 0) {
      user = await query(checkDoctorSQL, [email]);
      role = "doctor";
      userIDField = "doctorID";
    }

    if (user.length === 0) {
      // If no user is found, return an error
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user = user[0]; // Get the first user result

    // Check if the password matches the one in the database
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userID = user[userIDField];
    // Generate a JWT token with the user's ID and role
    const token = jwt.sign(
      { id: userID, role: role }, // Payload (user id and role)
      JWT_SECRET, // Secret
      { expiresIn: "1h" } // Token expiration
    );

    // Return the token and user information
    return res.status(200).json({
      message: "Login successful",
      token, // JWT Token
      user: { id: userID, email: user.email, role }, // User info
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Function to handle user registration
export async function register(req, res) {
  const { confirmPassword, ...userData } = req.body;
  let connection;

  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Begin transaction

    // Check if the email already exists
    const checkEmailSQL = "SELECT * FROM patient WHERE email = ?";
    const [existingUsers] = await connection.query(checkEmailSQL, [
      userData.email,
    ]);

    if (existingUsers.length > 0) {
      console.error("Email already exists");
      await connection.rollback();
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Insert or get the address ID
    console.log("Inserting or retrieving address ID");
    const addressID = await getAddressID(
      userData.addrStreet,
      userData.addrZip,
      userData.addrCity,
      userData.addrState
    );

    console.log("Address ID obtained:", addressID);

    // Insert the patient
    const insertPatientSQL = `
            INSERT INTO patient 
            (firstName, lastName, dateOfBirth, gender, height, weight, phoneNumber, email, password, lastLogin, emergencyPhoneNumber,
             emergencyEmail, createdBy, createdAt, updatedBy, updatedAt, addressID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

    console.log("Inserting patient information");
    const insertResult = await connection.query(insertPatientSQL, [
      userData.firstName,
      userData.lastName,
      userData.dateOfBirth,
      userData.gender,
      userData.height,
      userData.weight,
      userData.phoneNumber,
      userData.email,
      userData.password,
      new Date(), // lastLogin
      userData.emergencyPhoneNumber,
      userData.emergencyEmail,
      "user",
      new Date(), // createdAt
      "user",
      new Date(), // updatedAt
      addressID,
    ]);

    console.log("Patient insert result:", insertResult);

    await connection.commit(); // Commit transaction
    console.log("Transaction committed");
    return res.status(200).json({ message: "Registration Successful!" });
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Rollback on error
    }
    console.error("Registration Error:", error.message || error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool if it was successfully acquired
    }
  }
}
