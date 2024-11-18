import { SELECT_PATIENT_SERVICES } from "../../queries/constants/selectQueries.js";
import pool from "../../database.js";

// export async function getPatientServices(req, res) {
//   try {
//     const [rows] = await pool.query(SELECT_PATIENT_SERVICES);
//     const services = rows.map((row) => ({
//       patientName: `${row.patientFirstName} ${row.patientLastName}`,
//       appointments: {
//         id: row.appointmentID,
//         createdAt: row.appointmentCreatedAt,
//         updatedAt: row.appointmentUpdatedAt,
//       },
//       medicalRecords: {
//         allergen: row.medicalAllergy,
//         disability: row.medicalDisability,
//         surgery: row.medicalSurgery,
//       },
//       medicine: {
//         name: row.prescriptionMedicationName,
//         dateIssued: row.prescriptionDateIssued,
//         start: row.prescriptionStartDate,
//         end: row.prescriptionEndDate,
//       },
//       billing: {
//         id: row.billingID,
//         dateIssued: row.billingDateIssued,
//         dueDate: row.billingDueDate,
//       },
//       insurance: {
//         providerName: row.insuranceProvider,
//         expirationDate: row.insuranceExpirationDate,
//       },
//     }));
//     res.status(200).json(services);
//   } catch (error) {
//     console.error("Error fetching patient services:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
export async function getPatientServices(req, res) {
    try {
      const [rows] = await pool.query(SELECT_PATIENT_SERVICES);
      const services = rows.map((row) => ({
        patientName: `${row.patientFirstName} ${row.patientLastName}`,
        appointments: row.appointmentIDs
          ? row.appointmentIDs.split(",").map((id, index) => ({
              id,
              createdAt: row.appointmentCreatedAts.split(",")[index],
              updatedAt: row.appointmentUpdatedAts.split(",")[index],
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
              dateIssued: row.prescriptionDatesIssued.split(",")[index],
              start: row.prescriptionStartDates.split(",")[index],
              end: row.prescriptionEndDates.split(",")[index],
            }))
          : [],
        billing: row.billingIDs
          ? row.billingIDs.split(",").map((id, index) => ({
              id,
              dateIssued: row.billingDatesIssued.split(",")[index],
              dueDate: row.billingDueDates.split(",")[index],
            }))
          : [],
        insurance: row.insuranceProviders
          ? row.insuranceProviders.split(",").map((provider, index) => ({
              providerName: provider,
              expirationDate: row.insuranceExpirationDates.split(",")[index],
            }))
          : [],
      }));
      res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching patient services:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  