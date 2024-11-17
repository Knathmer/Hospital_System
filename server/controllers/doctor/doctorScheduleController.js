import { query } from "../../database.js";
import pool from "../../database.js";
import {
  GET_DOCTOR_SCHEDULE,
  GET_PATIENT_INFO_DOC_APPT,
  GET_PATIENT_INSURANCE_DOC_APPT,
  GET_PATIENT_ALLERGIES,
  GET_PATIENT_DISABILITIES,
  GET_PATIENT_FAMILY_HISTORY,
  GET_PATIENT_SURGERIES,
  GET_PATIENT_VACCINE,
  GET_PATIENT_APPOINTMENT_INFO,
  GET_PREVIOUS_APPOINTMENTS,
  SELECT_PATIENT_MEDICATION_INFORMATION_QUERY,
  SELECT_PATIENT_PHARMACY_INFORMATION_QUERY,
  GET_ADDITIONAL_CHARGES,
} from "../../queries/constants/selectQueries.js";

export const getDoctorSchedule = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const startOfDayStr = startOfDay
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace("T", " ");

    const doctorID = req.user.doctorID;
    const doctorSchedule = await query(GET_DOCTOR_SCHEDULE, [
      doctorID,
      startOfDayStr,
      endOfDayStr,
    ]);

    if (doctorSchedule.length === 0) {
      return res.status(200).json({
        message: "Doctor does not have any scheduled appointments for today",
      });
    }

    res.status(200).json({ doctorSchedule });
  } catch (error) {
    console.error("Error fetching doctor's daily schedule", error);
    res.status(500).json({ message: "Server error fetching schedule" });
  }
};

export const putMissedAppointment = async (req, res) => {
  try {
    const { appointmentID, status } = req.body;

    const [result] = await query(
      "UPDATE appointment a SET a.status = ?  WHERE a.appointmentID = ? AND a.status <> ?;",
      [status, appointmentID, status]
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No updates made" });
    }
    res.json({ success: true, message: "Appointment status updated." });
  } catch (error) {}
};

export const getPatientInformation = async (req, res) => {
  try {
    const doctorID = req.user.doctorID;
    const { appointmentID } = req.query;

    if (!appointmentID) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const [patientInfo] = await query(GET_PATIENT_INFO_DOC_APPT, [
      appointmentID,
      doctorID,
    ]);

    if (!patientInfo) {
      return res.status(200).json({ message: "Patient not found!" });
    }

    res.status(200).json({ patientInfo });
  } catch (error) {
    console.error("Error fetching patient information ", error);
    res.status(500).json({ message: "Server error fetching patient info" });
  }
};

export const getInsuranceInformation = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const [insuranceInformation] = await query(GET_PATIENT_INSURANCE_DOC_APPT, [
      patientID,
    ]);

    if (!insuranceInformation) {
      return res
        .status(200)
        .json({ message: "Insurance information not found!" });
    }

    res.status(200).json({ insuranceInformation });
  } catch (error) {
    console.error("Error fetching patient's insurance information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's insurance info" });
  }
};

export const getAllergiesInformation = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const allergiesInformation = await query(GET_PATIENT_ALLERGIES, [
      patientID,
    ]);

    res.status(200).json({ allergiesInformation });
  } catch (error) {
    console.error("Error fetching patient's allergies information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's allergies info" });
  }
};

export const getDisabilitiesInformation = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const disabilitiesInformation = await query(GET_PATIENT_DISABILITIES, [
      patientID,
    ]);

    res.status(200).json({ disabilitiesInformation });
  } catch (error) {
    console.error("Error fetching patient's disabilities information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's disabilities info" });
  }
};

export const getFamilyHistoryInformation = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const familyHistoryInformation = await query(GET_PATIENT_FAMILY_HISTORY, [
      patientID,
    ]);

    res.status(200).json({ familyHistoryInformation });
  } catch (error) {
    console.error(
      "Error fetching patient's family history information ",
      error
    );
    res
      .status(500)
      .json({ message: "Server error fetching patient's family history info" });
  }
};

export const getSurgeriesInformation = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const surgeryInformation = await query(GET_PATIENT_SURGERIES, [patientID]);

    res.status(200).json({ surgeryInformation });
  } catch (error) {
    console.error("Error fetching patient's surgeries information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's surgeries info" });
  }
};

export const getVaccinesInformation = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const vaccineInformation = await query(GET_PATIENT_VACCINE, [patientID]);

    res.status(200).json({ vaccineInformation });
  } catch (error) {
    console.error("Error fetching patient's vaccine information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's vaccine info" });
  }
};

export const getAppointmentInformation = async (req, res) => {
  try {
    const doctorID = req.user.doctorID;
    const { patientID, appointmentID } = req.query;

    if (!patientID || !appointmentID || !doctorID) {
      return res
        .status(400)
        .json({ message: "Unauthorized access to appointment" });
    }

    const [appointmentInformation] = await query(GET_PATIENT_APPOINTMENT_INFO, [
      appointmentID,
      patientID,
      doctorID,
    ]);

    res.status(200).json({ appointmentInformation });
  } catch (error) {
    console.error("Error fetching patient's vaccine information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's vaccine info" });
  }
};

export const getPreviousAppointments = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const previousAppointments = await query(GET_PREVIOUS_APPOINTMENTS, [
      patientID,
    ]);

    res.status(200).json({ previousAppointments });
  } catch (error) {
    console.error("Error fetching patient's disabilities information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's disabilities info" });
  }
};

export const getPatientMedication = async (req, res) => {
  try {
    const { patientID } = req.query;

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required!" });
    }

    const patientMedication = await query(
      SELECT_PATIENT_MEDICATION_INFORMATION_QUERY,
      [patientID]
    );

    res.status(200).json({ patientMedication });
  } catch (error) {
    console.error("Error fetching patient's medication information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's medication info" });
  }
};

export const getPharmacies = async (req, res) => {
  try {
    const doctorID = req.user.doctorID;
    const { patientID } = req.query;

    const patientPharmacies = await query(
      SELECT_PATIENT_PHARMACY_INFORMATION_QUERY,
      [patientID]
    );

    res.status(200).json({ patientPharmacies });
  } catch (error) {
    console.error("Error fetching patient's pharmacy information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching patient's pharmacy info" });
  }
};

export const getAdditionalCharges = async (req, res) => {
  try {
    const { specialtyID } = req.query;

    const additionalCharges = await query(GET_ADDITIONAL_CHARGES, [
      specialtyID,
    ]);

    res.status(200).json({ additionalCharges });
  } catch (error) {
    console.error("Error fetching additional charges information ", error);
    res
      .status(500)
      .json({ message: "Server error fetching additional charges info" });
  }
};

export const deactivateMedication = async (req, res) => {
  try {
    const { prescriptionID } = req.body;

    if (!prescriptionID) {
      return res.status(400).json({ message: "Prescription ID is required" });
    }

    // Update the medication to set active to false
    await query("UPDATE prescription SET active = 0 WHERE prescriptionID = ?", [
      prescriptionID,
    ]);

    res.status(200).json({ message: "Medication deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating medication:", error);
    res.status(500).json({ message: "Server error deactivating medication" });
  }
};

export const reactivateMedication = async (req, res) => {
  try {
    const { prescriptionID } = req.body;

    if (!prescriptionID) {
      return res.status(400).json({ message: "Prescription ID is required" });
    }

    // Update the medication to set active to true
    await query("UPDATE prescription SET active = 1 WHERE prescriptionID = ?", [
      prescriptionID,
    ]);

    res.status(200).json({ message: "Medication reactivated successfully" });
  } catch (error) {
    console.error("Error reactivating medication:", error);
    res.status(500).json({ message: "Server error reactivating medication" });
  }
};

export const postNewMedication = async (req, res) => {
  try {
    const doctorID = req.user.doctorID;

    const {
      medicationName,
      dosage,
      frequency,
      start,
      end,
      quantity,
      instruction,
      daySupply,
      refillCount,
      refillsRemaining,
      pharmacyID,
      patientID,
    } = req.body;

    if (
      !medicationName ||
      !dosage ||
      !frequency ||
      !start ||
      !quantity ||
      !daySupply ||
      refillCount === undefined ||
      refillsRemaining === undefined ||
      !patientID
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }
    const startDate = new Date(start);
    const endDate = end
      ? new Date(end)
      : new Date(startDate.setFullYear(startDate.getFullYear() + 1));

    const sql = `
      INSERT INTO prescription (
        medicationName,
        dosage,
        frequency,
        start,
        end,
        quantity,
        instruction,
        refillCount,
        daySupply,
        refillsRemaining,
        pharmacyID,
        patientID,
        doctorID,
        active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    const values = [
      medicationName,
      dosage,
      frequency,
      start,
      endDate || null, // Use the calculated or provided end date
      quantity,
      instruction || null, // If instruction is not provided, use NULL
      refillCount,
      daySupply,
      refillsRemaining,
      pharmacyID || null, // If pharmacyID is not provided, use NULL
      patientID,
      doctorID, // If doctorID is not provided, use NULL
    ];

    await query(sql, values);
    res.status(201).json({ message: "Medication added successfully." });
  } catch (error) {
    console.error("Error saving medication:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the medication." });
  }
};

export const refillMedication = async (req, res) => {
  try {
    const doctorID = req.user.doctorID;
    const { prescriptionID } = req.body;

    const sql =
      "UPDATE prescription SET refillsRemaining = refillCount WHERE prescriptionID = ?;";

    await query(sql, [prescriptionID]);

    res
      .status(201)
      .json({ message: "Medication refill count updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while updating the medicaiton" });
  }
};

export const completeAppointment = async (req, res) => {
  let connection;
  try {
    //Get information passed from the front end
    const doctorID = req.user.doctorID;
    const { appointmentID, patientID, notes } = req.body;

    //Validate that you have the necessary information. You need all of these pieces of passed infomration
    if (!appointmentID || !doctorID || !patientID || notes) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //Get a connection from the pool
    connection = await pool.getConnection();

    //Start a transaction, these are use to update multiple tables at once
    //If one fails, all of them fail. This is used to get consistent data and no mismatch
    await connection.beginTransaction();

    const insertVisitNotesQuery = `INSERT INTO visit_notes (appointmentID, patientID, doctorID, notes)
      VALUES (?, ?, ?, ?)`;

    const [visitNotesResult] = await connection.execute(insertVisitNotesQuery, [
      appointmentID,
      patientID,
      doctorID,
      notes,
    ]);
    const visitNotesID = visitNotesResult.insertId;

    // Update appointment to reference visit_notes and set status to 'Completed'
    //COME BACK TO THIS FIX THIS
    //   const updateAppointmentQuery = `
    //   UPDATE appointment
    //   SET status = 'Completed', afterAppointmentNotes = ?, visitNotesID = ?
    //   WHERE appointmentID = ?
    // `;
    //   await connection.execute(updateAppointmentQuery, [
    //     notes,
    //     visitNotesID,
    //     appointmentID,
    //   ]);

    // Commit the transaction
    await connection.commit();

    res.status(200).json({ message: "Appointment completed successfully." });
  } catch (error) {
    if (connection) {
      // Rollback the transaction in case of error
      await connection.rollback();
    }
    console.error("Error completing appointment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while completing the appointment." });
  } finally {
    if (connection) {
      // Release the connection back to the pool
      connection.release();
    }
  }
};

export const saveCharges = async (req, res) => {
  let connection;
  try {
    const {
      appointmentID,
      baseServicePrice = 0,
      selectedAdditionalCharges = [],
      customCharges = [],
      totalAmount = 0,
      patientID,
      officeID,
      insuranceID,
      serviceID,
    } = req.body;

    if (!appointmentID) {
      return res.status(400).json({ error: "appointmentID is required" });
    }

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Check if bill exists for the appointment
    let [bill] = await connection.execute(
      "SELECT billID FROM bill WHERE appointmentID = ?",
      [appointmentID]
    );

    let billID;
    if (bill.length > 0) {
      billID = bill[0].billID;
    } else {
      const [result] = await connection.execute(
        "INSERT INTO bill (appointmentID, amount, patientID, paidStatus, dueDate, officeID, insuranceID, serviceID) VALUES (?, ?, ?, 'Pending', DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?, ?);",
        [
          appointmentID,
          totalAmount,
          patientID,
          officeID,
          insuranceID,
          serviceID,
        ]
      );
      billID = result.insertId;
    }

    // Delete existing charges to prevent duplicates
    await connection.execute(
      "DELETE FROM bill_additional_charge WHERE billID = ?",
      [billID]
    );
    await connection.execute("DELETE FROM custom_charge WHERE billID = ?", [
      billID,
    ]);

    // Insert additional charges if valid
    for (const charge of selectedAdditionalCharges) {
      if (charge.ACTID && charge.price) {
        await connection.execute(
          "INSERT INTO bill_additional_charge (billID, additionalChargeTypeID, amount) VALUES (?, ?, ?)",
          [billID, charge.ACTID, charge.price]
        );
      }
    }

    // Insert custom charges if valid
    for (const customCharge of customCharges) {
      if (customCharge.description && customCharge.amount) {
        await connection.execute(
          "INSERT INTO custom_charge (billID, description, amount) VALUES (?, ?, ?)",
          [billID, customCharge.description.trim(), customCharge.amount]
        );
      }
    }

    // Update the total amount in the bill
    await connection.execute("UPDATE bill SET amount = ? WHERE billID = ?", [
      totalAmount,
      billID,
    ]);

    // Commit transaction
    await connection.commit();

    res.status(200).json({ message: "Charges saved successfully." });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error saving charges:", error);
    res.status(500).json({ error: "An error occurred while saving charges." });
  } finally {
    if (connection) connection.release();
  }
};

// Add Allergy
export const addAllergy = async (req, res) => {
  try {
    const { patientID, allergen, reaction, severity, notes } = req.body;

    // Validate required fields
    if (!patientID || !allergen || !reaction || !severity) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Validate severity enum
    const validSeverities = ["Mild", "Moderate", "Severe"];
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({
        error:
          'Invalid severity value. Must be "Mild", "Moderate", or "Severe".',
      });
    }

    // Insert into database
    const result = await query(
      "INSERT INTO allergy (patientID, allergen, reaction, severity, notes) VALUES (?, ?, ?, ?, ?)",
      [patientID, allergen, reaction, severity, notes || null]
    );

    // Return success response with the new allergyID
    res.status(201).json({
      message: "Allergy added successfully.",
      allergyID: result.insertId,
    });
  } catch (error) {
    console.error("Error adding allergy:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the allergy." });
  }
};

// Add Disability
export const addDisability = async (req, res) => {
  try {
    const { patientID, disabilityType, notes } = req.body;

    // Validate required fields
    if (!patientID || !disabilityType) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Insert into database
    const result = await query(
      "INSERT INTO disability (patientID, disabilityType, notes) VALUES (?, ?, ?)",
      [patientID, disabilityType, notes || null]
    );

    // Return success response with the new disabilityID
    res.status(201).json({
      message: "Disability added successfully.",
      disabilityID: result.insertId,
    });
  } catch (error) {
    console.error("Error adding disability:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the disability." });
  }
};

// Add Family History
export const addFamilyHistory = async (req, res) => {
  try {
    const { patientID, condition, notes } = req.body;

    // Validate required fields
    if (!patientID || !condition) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Insert into database
    const result = await query(
      "INSERT INTO family_history (patientID, `condition`, notes) VALUES (?, ?, ?)",
      [patientID, condition, notes || null]
    );

    // Return success response with the new familyHistoryID
    res.status(201).json({
      message: "Family history added successfully.",
      familyHistoryID: result.insertId,
    });
  } catch (error) {
    console.error("Error adding family history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the family history." });
  }
};

// Add Surgery
export const addSurgery = async (req, res) => {
  try {
    const { patientID, surgeryType, surgeryDateTime } = req.body;
    const doctorID = req.user.doctorID;

    // Validate required fields
    if (!patientID || !surgeryType || !surgeryDateTime) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Insert into database
    const result = await query(
      "INSERT INTO surgery (patientID, surgeryType, surgeryDateTime, doctorID) VALUES (?, ?, ?, ?)",
      [patientID, surgeryType, surgeryDateTime, doctorID]
    );

    // Return success response with the new surgeryID
    res.status(201).json({
      message: "Surgery added successfully.",
      surgeryID: result.insertId,
    });
  } catch (error) {
    console.error("Error adding surgery:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the surgery." });
  }
};

// Add Vaccine
export const addVaccine = async (req, res) => {
  try {
    const { patientID, vaccineName, dateAdministered } = req.body;
    const doctorID = req.user.doctorID;

    // Validate required fields
    if (!patientID || !vaccineName || !dateAdministered) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Insert into database
    const result = await query(
      "INSERT INTO vaccine (patientID, vaccineName, dateAdministered, doctorID) VALUES (?, ?, ?, ?)",
      [patientID, vaccineName, dateAdministered, doctorID]
    );

    // Return success response with the new vaccineID
    res.status(201).json({
      message: "Vaccine added successfully.",
      vaccineID: result.insertId,
    });
  } catch (error) {
    console.error("Error adding vaccine:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the vaccine." });
  }
};
