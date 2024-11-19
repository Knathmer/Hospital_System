import { SELECT_PATIENT_SERVICES } from "../../queries/constants/selectQueries.js";
import pool from "../../database.js";
export async function getPatientServices(req, res) {
    try {
      const [rows] = await pool.query(SELECT_PATIENT_SERVICES);
      const services = rows.map((row) => ({
        patientName: `${row.patientFirstName} ${row.patientLastName}`,
        appointments: row.appointmentIDs
          ? row.appointmentIDs.split(",").map((id, index) => ({
              id,
              createdAt: row.appointmentCreatedAts
                ? row.appointmentCreatedAts.split(",")[index] || null
                : null,
              updatedAt: row.appointmentUpdatedAts
                ? row.appointmentUpdatedAts.split(",")[index] || null
                : null,
            }))
          : [],
        medicalRecords: {
          allergies: row.medicalAllergies ? row.medicalAllergies.split(",") : [],
          disabilities: row.medicalDisabilities ? row.medicalDisabilities.split(",") : [],
          surgeries: row.medicalSurgeries ? row.medicalSurgeries.split(",") : [],
        },
        medicine: row.prescriptionMedicationNames
          ? row.prescriptionMedicationNames.split(",").map((name, index) => ({
              name,
              dateIssued: row.prescriptionDatesIssued
                ? row.prescriptionDatesIssued.split(",")[index] || null
                : null,
              start: row.prescriptionStartDates
                ? row.prescriptionStartDates.split(",")[index] || null
                : null,
              end: row.prescriptionEndDates
                ? row.prescriptionEndDates.split(",")[index] || null
                : null,
            }))
          : [],
        billing: row.billingIDs
          ? row.billingIDs.split(",").map((id, index) => ({
              id,
              dateIssued: row.billingDatesIssued
                ? row.billingDatesIssued.split(",")[index] || null
                : null,
              dueDate: row.billingDueDates
                ? row.billingDueDates.split(",")[index] || null
                : null,
            }))
          : [],
        insurance: row.insuranceProviders
          ? row.insuranceProviders.split(",").map((provider, index) => ({
              providerName: provider,
              expirationDate: row.insuranceExpirationDates
                ? row.insuranceExpirationDates.split(",")[index] || null
                : null,
            }))
          : [],
      }));
      res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching patient services:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }