import { query } from "../database.js"; // Import the query function
import pool from "../database.js"; // You can also import the pool if needed for transactions
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  INSERT_ADDRESS_QUERY,
  INSERT_PATIENT_QUERY,
  INSERT_EMERGENCY_CONTACT_QUERY,
} from "../queries/constants/insertQueries.js";
import {
  SELECT_ADDRESSID_QUERY,
  SELECT_PATIENT_FROM_EMAIL_QUERY,
} from "../queries/constants/selectQueries.js";
import { getUserAndRole } from "../queries/user/getUserAndRole.js";

const JWT_SECRET = process.env.JWT_SECRET; //Pulls the ENV secret key from .env

// Helper function for getting or inserting an address
async function getAddressID(connection, addrStreet, addrZip, addrCity, addrState) {
  try {
    const [addresses] = await connection.query(SELECT_ADDRESSID_QUERY, [
      addrStreet,
      addrZip,
      addrCity,
      addrState,
    ]);

    if (addresses.length > 0) {
      return addresses[0].addressID;
    } else {
      // Insert the new address
      const [insertResult] = await connection.query(INSERT_ADDRESS_QUERY, [
        addrStreet,
        addrZip,
        addrCity,
        addrState,
      ]);
      return insertResult.insertId;
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
    // Get user and role if one exists
    let [user, role, userIDField] = await getUserAndRole(email);

    // If no user is found, return an error
    if (user === null) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password matches the one in the database
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userID = user[userIDField];
    let tokenPayload;

    // Generate the JWT payload based on the user's role
    if (role === "patient") {
      tokenPayload = { patientID: userID, role };
    } else if (role === "doctor") {
      tokenPayload = { doctorID: userID, role };
    } else if (role === "admin") {
      tokenPayload = { adminID: userID, role };
    } else {
      return res.status(400).json({ message: "Unknown user role" });
    }

    // Generate a JWT token with the user's ID and role
    const token = jwt.sign(
      tokenPayload, // Payload (user id and role)
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
    const [existingUsers] = await connection.query(
      SELECT_PATIENT_FROM_EMAIL_QUERY,
      [userData.email]
    );

    if (existingUsers.length > 0) {
      console.error("Email already exists");
      await connection.rollback();
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Insert or get the address ID
    console.log("Inserting or retrieving address ID");
    const addressID = await getAddressID(
      connection,
      userData.addrStreet,
      userData.addrZip,
      userData.addrCity,
      userData.addrState
    );
    

    console.log("Address ID obtained:", addressID);

    // Insert the patient
    console.log("Inserting patient information");
    const [insertResult] = await connection.query(INSERT_PATIENT_QUERY, [
      userData.firstName,        // 1
      userData.lastName,         // 2
      userData.dateOfBirth,      // 3
      userData.gender,           // 4
      userData.phoneNumber,      // 5
      userData.email,            // 6
      userData.password,         // 7
      new Date(),                // 8 - lastLogin
      "user",                    // 9 - createdBy
      new Date(),                // 10 - createdAt
      "user",                    // 11 - updatedBy
      new Date(),                // 12 - updatedAt
      addressID,                 // 13
    ]);
    
    const patientID = insertResult.insertId;
    console.log("Patient ID obtained:", patientID);

    console.log("Patient insert result:", insertResult);

    const emergencyInsertResult = await connection.query(INSERT_EMERGENCY_CONTACT_QUERY, [
      userData.emergencyFirstName,
      userData.emergencyLastName,
      userData.emergencyRelationship,
      userData.emergencyPhoneNumber,
      userData.emergencyEmail,
      patientID,
    ]);

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
