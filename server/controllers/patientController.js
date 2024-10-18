import { query } from "../database.js"; //Import query function from database.js

export const getPatientMedication = async (req, res) => {
  try {
    //Get the patientID from the token payload, will hold the PK of the patient to make queries.
    const patientID = req.user.id;

    //This is the query to get the prescription data we need from the database.
    const SQLQuery = `SELECT p.medicationName, p.dosage, p.frequency, p.instruction, p.start, p.end
                      FROM prescription AS p
                      WHERE p.patientID = ?`;

    //This makes the query with the patientID which should return the users medication.
    const patientMedications = query(SQLQuery, [patientID]);

    //The query function returns an array of objects, each object being a query result.

    //If the query runs and does not find a prescription for the user, then it returns an empty array.
    if (patientMedications.length === 0) {
      return res.status(404).json({ message: "No medication found" });
    }

    //If it finds a prescription for the user it returns the precription information.
    res.status(200).json({ patientMedications });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
};
