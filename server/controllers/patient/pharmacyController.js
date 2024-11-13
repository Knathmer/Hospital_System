import { query } from "../../database.js";
import { SELECT_PHARMACY_CHECK_EXISTS_ALREADY } from "../../queries/constants/selectQueries.js";
import { INSERT_NEW_PHARMACY_QUERY } from "../../queries/constants/insertQueries.js";

export const getAllPharmacies = async (req, res) => {
  try {
    const allPharmacies = await query("SELECT * FROM pharmacy;");
    res.status(200).json({ allPharmacies });
  } catch (error) {
    console.error("Error fetching all pharmacies: ", error);
    res.status(500).json({ message: "Server error fetching all pharmacies" });
  }
};

export const postNewPharmacy = async (req, res) => {
  try {
    //Get the user's PK
    const patientID = req.user.patientID;

    //Extract pharmacy data from the request body.
    const { pharmacyName, address, city, state, zipCode, phoneNumber } =
      req.body;

    if (
      !pharmacyName ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: "All fields are requred" });
    }

    const existingPharmacy = await query(SELECT_PHARMACY_CHECK_EXISTS_ALREADY, [
      pharmacyName,
      address,
      city,
      state,
      zipCode,
      phoneNumber,
    ]);

    let pharmacyID;

    if (existingPharmacy.length > 0) {
      pharmacyID = existingPharmacy[0].pharmacyID;
    } else {
      // const createdAt = new Date().toISOString();

      const result = await query(INSERT_NEW_PHARMACY_QUERY, [
        pharmacyName,
        address,
        city,
        state,
        zipCode,
        phoneNumber,
      ]);
      pharmacyID = result.insertId;
    }
    const existingAssociation = await query(
      "SELECT * FROM patient_pharmacy WHERE patientID = ? AND pharmacyID = ?",
      [patientID, pharmacyID]
    );

    if (existingAssociation.length > 0) {
      return res
        .status(400)
        .json({ message: "Pharmacy already associated with patient" });
    }

    // Insert the association
    await query(
      "INSERT INTO patient_pharmacy (patientID, pharmacyID) VALUES (?, ?)",
      [patientID, pharmacyID]
    );

    // Fetch the newly added or existing pharmacy data to send back in the response
    const [pharmacy] = await query(
      "SELECT * FROM pharmacy WHERE pharmacyID = ?",
      [pharmacyID]
    );

    // Send the pharmacy data in the response
    res.status(200).json({ message: "Pharmacy added", pharmacy });
  } catch (error) {
    console.error("Error adding pharmacy for patient:", error);
    res.status(500).json({ message: "Error adding pharmacy for patient" });
  }
};

export const postToPatientPharmacy = async (req, res) => {
  try {
    // Extract patient ID from the authenticated user
    const patientID = req.user.patientID; // Assuming patientID is stored in req.user

    // Extract pharmacyID from the request body
    const { pharmacyID } = req.body;

    // Validate the input data
    if (!pharmacyID) {
      return res.status(400).json({ message: "Pharmacy ID is required" });
    }

    // Check if the pharmacy exists
    const pharmacy = await query(
      "SELECT * FROM pharmacy WHERE pharmacyID = ?",
      [pharmacyID]
    );

    if (pharmacy.length === 0) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    // Check if the association already exists to prevent duplicates
    const existingAssociation = await query(
      "SELECT * FROM patient_pharmacy WHERE patientID = ? AND pharmacyID = ?",
      [patientID, pharmacyID]
    );

    if (existingAssociation.length > 0) {
      return res
        .status(400)
        .json({ message: "Pharmacy already associated with patient" });
    }

    // Insert the association into patient_pharmacy table
    await query(
      "INSERT INTO patient_pharmacy (patientID, pharmacyID) VALUES (?, ?)",
      [patientID, pharmacyID]
    );

    // Optionally, you can fetch the pharmacy data to send back in the response
    const [associatedPharmacy] = await query(
      "SELECT * FROM pharmacy WHERE pharmacyID = ?",
      [pharmacyID]
    );

    // Send the response
    res.status(200).json({
      message: "Pharmacy associated with patient",
      pharmacy: associatedPharmacy,
    });
  } catch (error) {
    console.error("Error associating pharmacy with patient:", error);
    res
      .status(500)
      .json({ message: "Error associating pharmacy with patient" });
  }
};

export const deletePharmacyFromPatient = async (req, res) => {
  try {
    const patientID = req.user.patientID;
    const pharmacyID = req.params.pharmacyID;

    console.log(pharmacyID);

    const patientPharmacyExists = await query(
      "SELECT * FROM patient_pharmacy WHERE patientID = ? AND pharmacyID = ?",
      [patientID, pharmacyID]
    );

    if (patientPharmacyExists.length === 0) {
      return res
        .status(404)
        .json({ message: "Pharmacy association not found" });
    }

    await query(
      "DELETE FROM patient_pharmacy WHERE patientID = ? AND pharmacyID = ?",
      [patientID, pharmacyID]
    );

    await query(
      "UPDATE prescription SET pharmacyID = NULL WHERE patientID = ? AND pharmacyID = ?",
      [patientID, pharmacyID]
    );

    res.status(200).json({ message: "Pharmacy association removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing pharmacy association" });
  }
};
