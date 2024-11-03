import {
  SELECT_PATIENT_MEDICATION_INFORMATION_QUERY,
  SELECT_PATIENT_PHARMACY_INFORMATION_QUERY,
  GET_REFILL_HISTORY,
} from "../../queries/constants/selectQueries.js";
import { query } from "../../database.js";
export const getPatientMedications = async (req, res) => {
  try {
    // This is the patient's primary key, which was stored in the JWT Payload.
    const patientID = req.user.patientID;

    const patientMedicationInformation = await query(
      SELECT_PATIENT_MEDICATION_INFORMATION_QUERY,
      [patientID]
    );

    if (patientMedicationInformation.length === 0) {
      return res.status(404).json({ message: "No Medication Found" });
    }
    res.status(200).json({ patientMedicationInformation });
  } catch (error) {
    console.error("Error fetching patient's medication ", error);
    res.status(500).json({ message: "Server error fetching medications" });
  }
};

export const getPatientPharmacy = async (req, res) => {
  try {
    //Get the current users primary key.
    const patientID = req.user.patientID;

    const patientPharmacyInformation = await query(
      SELECT_PATIENT_PHARMACY_INFORMATION_QUERY,
      [patientID]
    );

    //If the user has no pharmacies attached to them then return the following message.
    if (patientPharmacyInformation.length === 0) {
      return res.status(404).json({ message: "No pharmacies found" });
    }

    //If the user does have a pharmacy send back the query result.
    res.status(200).json({ patientPharmacyInformation });
  } catch (error) {
    console.error("Error fetching patient's pharmacy information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching pharmacy information" });
  }
};

export const postPatientRefill = async (req, res) => {
  try {
    const patientID = req.user.patientID; // Assuming req.user is set by authentication middleware
    const { prescriptionIDs } = req.body;

    if (!prescriptionIDs || prescriptionIDs.length === 0) {
      return res.status(400).json({ message: "Missing prescription IDs." });
    }

    // Prepare to store promises for refill insertions
    const refillPromises = prescriptionIDs.map(async (prescriptionID) => {
      // Query to find doctorID based on prescriptionID
      const [doctorResult] = await query(
        "SELECT doctorID FROM prescription WHERE prescriptionID = ?",
        [prescriptionID]
      );

      const doctorID = doctorResult ? doctorResult.doctorID : null;

      // Insert into refill table
      return query(
        "INSERT INTO refill (patientID, prescriptionID, doctorID, status) VALUES (?, ?, ?, 'Pending')",
        [patientID, prescriptionID, doctorID]
      );
    });

    // Execute all insertions
    await Promise.all(refillPromises);

    res
      .status(201)
      .json({ message: "Refill requests submitted successfully." });
  } catch (error) {
    console.error("Error posting refill request:", error);
    res.status(500).json({ message: "Error submitting refill requests." });
  }
};

export const getRefillHistory = async (req, res) => {
  try {
    const patientID = req.user.patientID;

    const history = await query(GET_REFILL_HISTORY, [patientID]);

    res.status(200).json({ history });
  } catch (error) {
    console.error("Error getting refill history request:", error);
    res.status(500).json({ message: "Error getting refill history requests." });
  }
};
