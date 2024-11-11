import { query } from "../../database.js";

export async function getPatientInfo(req, res) {
  const doctorID = req.user.doctorID;
  const { patientID } = req.params;

  try {
    // Verify doctor's association with the patient
    const association = await query(
      "SELECT * FROM appointment WHERE doctorID = ? AND patientID = ?",
      [doctorID, patientID]
    );

    if (association.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Fetch patient data
    const [patient] = await query(
      `SELECT p.*, 
              CONCAT(a.addrStreet, ', ', a.addrcity, ', ', a.addrstate, ' ', a.addrzip) AS address
       FROM patient p
       LEFT JOIN address a ON p.addressID = a.addressID
       WHERE p.patientID = ?`,
      [patientID]
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Fetch additional patient info
    const allergies = await query(
      "SELECT * FROM allergy WHERE patientID = ?",
      [patientID]
    );

    const disabilities = await query(
      "SELECT * FROM disability WHERE patientID = ?",
      [patientID]
    );

    const emergencyContacts = await query(
      `SELECT ec.*
       FROM emergency_contact ec
       WHERE ec.patientID = ?`,
      [patientID]
    );

    const insurance = await query(
      "SELECT * FROM insurance WHERE patientID = ?",
      [patientID]
    );

    const prescriptions = await query(
      "SELECT * FROM prescription WHERE patientID = ?",
      [patientID]
    );

    const surgeries = await query(
      "SELECT * FROM surgery WHERE patientID = ?",
      [patientID]
    );

    const vitals = await query(
      "SELECT * FROM vitals WHERE patientId = ?",
      [patientID]
    );

    const vaccines = await query(
      "SELECT * FROM vaccine WHERE patientID = ?",
      [patientID]
    );

    // Fetch treatment plans, including doctor's name
    const treatmentPlans = await query(
      `SELECT tp.*, d.firstName AS doctorFirstName, d.lastName AS doctorLastName
       FROM treatment_plan tp
       LEFT JOIN doctor d ON tp.doctorID = d.doctorID
       WHERE tp.patientID = ?`,
      [patientID]
    );

    // Fetch family history
    const familyHistory = await query(
      "SELECT * FROM family_history WHERE patientID = ?",
      [patientID]
    );

    // Fetch completed appointments with visit notes and bills
    const appointments = await query(
      `SELECT a.*, 
              vn.notes AS visitNotes,
              b.amount AS billAmount,
              b.dueDate AS billDueDate,
              b.paidStatus AS billPaidStatus,
              b.paidAmount AS billPaidAmount
       FROM appointment a
       LEFT JOIN visit_notes vn ON a.appointmentID = vn.appointmentID
       LEFT JOIN bill b ON a.appointmentID = b.appointmentID
       WHERE a.patientID = ? AND a.status = 'Completed'`,
      [patientID]
    );

    // Fetch primary physician
    const [primaryPhysician] = await query(
      `SELECT d.firstName, d.lastName, d.specialty, d.workPhoneNumber, d.workEmail
       FROM patient_doctor pd
       JOIN doctor d ON pd.doctorID = d.doctorID
       WHERE pd.patientID = ? AND pd.isPrimary = TRUE`,
      [patientID]
    );

    // Build the response object
    const patientData = {
      ...patient,
      allergies,
      disabilities,
      emergencyContacts,
      insurance,
      prescriptions,
      surgeries,
      vitals,
      vaccines,
      treatmentPlans,
      familyHistory,
      appointments,
      primaryPhysician,
    };

    res.status(200).json(patientData);
  } catch (error) {
    console.error("Error fetching patient info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
