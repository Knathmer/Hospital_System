import { SELECT_PATIENT_SERVICES } from "../../queries/constants/selectQueries.js";
import pool from "../../database.js";

export async function getPatientServices(req, res) {
  try {
    const [rows] = await pool.query(SELECT_PATIENT_SERVICES);
    const services = rows.map((row) => ({
      patientName: `${row.patientFirstName} ${row.patientLastName}`,
      appointments: {
        id: row.appointmentID,
        createdAt: row.appointmentCreatedAt,
        updatedAt: row.appointmentUpdatedAt,
      },
      medicalRecords: {
        allergen: row.medicalAllergy,
        disability: row.medicalDisability,
        surgery: row.medicalSurgery,
      },
      medicine: {
        name: row.prescriptionMedicationName,
        dateIssued: row.prescriptionDateIssued,
        start: row.prescriptionStartDate,
        end: row.prescriptionEndDate,
      },
      billing: {
        id: row.billingID,
        dateIssued: row.billingDateIssued,
        dueDate: row.billingDueDate,
      },
      insurance: {
        providerName: row.insuranceProvider,
        expirationDate: row.insuranceExpirationDate,
      },
    }));
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching patient services:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
