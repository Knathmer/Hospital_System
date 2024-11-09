import {
  SELECT_PATIENT_MEDICATION_INFORMATION_QUERY,
  SELECT_PATIENT_PHARMACY_INFORMATION_QUERY,
  GET_REFILL_HISTORY,
  GET_PENDING_REQUESTS,
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

    const pendingRequests = [];

    // Prepare to store promises for refill insertions
    const refillPromises = prescriptionIDs.map(async (prescriptionID) => {
      // Step 1: Check if there is already a pending refill request for this prescription
      const [existingPending] = await query(
        "SELECT refillID FROM refill WHERE prescriptionID = ? AND patientID = ? AND status = 'Pending'",
        [prescriptionID, patientID]
      );

      if (existingPending) {
        pendingRequests.push(prescriptionID);
        return null; // Skip this request
      }

      // Step 2: Query to find doctorID based on prescriptionID
      const [doctorResult] = await query(
        "SELECT doctorID, refillCount FROM prescription WHERE prescriptionID = ?",
        [prescriptionID]
      );

      const doctorID = doctorResult ? doctorResult.doctorID : null;
      const refillCount = doctorResult ? doctorResult.refillCount : 0;

      if (refillCount <= 0) {
        pendingRequests.push(prescriptionID);
        return null; // Skip this request if no refills are remaining
      }

      // Step 3: Insert into refill table
      await query(
        "INSERT INTO refill (patientID, prescriptionID, doctorID, status) VALUES (?, ?, ?, 'Pending')",
        [patientID, prescriptionID, doctorID]
      );

      // Step 4: Decrement the refill count by 1
      await query(
        "UPDATE prescription SET refillCount = refillCount - 1 WHERE prescriptionID = ?",
        [prescriptionID]
      );

      return prescriptionID; // Return the prescription ID if it was successfully inserted
    });

    // Execute all insertions
    const results = await Promise.all(refillPromises);

    const successfullyProcessed = results.filter((result) => result !== null);
    if (pendingRequests.length === prescriptionIDs.length) {
      return res.status(400).json({
        message:
          "All selected prescriptions already have pending refill requests or no refills remaining.",
      });
    } else if (pendingRequests.length > 0) {
      return res.status(201).json({
        message: `Refill requests submitted successfully for some prescriptions. The following already have pending requests or no refills remaining: ${pendingRequests.join(
          ", "
        )}`,
      });
    } else {
      return res.status(201).json({
        message: "Refill requests submitted successfully.",
      });
    }
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

export const getPendingRequests = async (req, res) => {
  try {
    const patientID = req.user.patientID;

    const pendingRequest = await query(GET_PENDING_REQUESTS, [patientID]);

    if (pendingRequest.length === 0) {
      return res
        .status(200)
        .json({ message: "Currently no pending refill requests" });
    }

    res.status(200).json({ pendingRequest });
  } catch (error) {
    console.error(
      "Error fetching patient's pending refill information ",
      error
    );
    res
      .status(500)
      .json({ message: "Server error fetching pending refill information" });
  }
};

export const updateMedicationPharmacyID = async (req, res) => {
  try {
    const patientID = req.user.patientID;
    const { pharmacyID } = req.body;
    const prescriptionID = req.params.prescriptionID;

    const prescription = await query(
      "SELECT * FROM prescription WHERE prescriptionID = ? AND patientID = ?",
      [prescriptionID, patientID]
    );

    if (!prescription) {
      return res.status(401).json({ message: "Prescription not found" });
    }

    const pharmacyAssociation = await query(
      "SELECT * FROM patient_pharmacy WHERE patientID = ? AND pharmacyID = ?",
      [patientID, pharmacyID]
    );

    if (!pharmacyAssociation) {
      return res.status(401).json({
        message: "Selecte pharmacy is not associated with your account.",
      });
    }

    await query(
      "UPDATE prescription SET pharmacyID = ? WHERE prescriptionID = ?",
      [pharmacyID, prescriptionID]
    );

    res.status(200).json({ message: "Pharmacy assigned successfully" });
  } catch (error) {
    console.error("Error updating prescription's pharmacy: ", error);
    res.status(500).json({ message: "Server error updating pharmacy" });
  }
};
