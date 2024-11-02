import {
  SELECT_PATIENT_MEDICATION_INFORMATION_QUERY,
  SELECT_PATIENT_PHARMACY_INFORMATION_QUERY,
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
