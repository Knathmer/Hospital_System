import { query } from "../../database.js";
import { PRESCRIPTION_REPORT_QUERY } from "../../queries/constants/reportQueries.js";

export async function getPrescriptionReport(req, res) {
  try {
    const { prescriptions } = req.query;
    console.log("filter backend: ", prescriptions.medication);

    // let medFilter = filter.prescriptions;
    // medFilter = medFilter.medicationName;
    const rows = await query(PRESCRIPTION_REPORT_QUERY, [
      `%${prescriptions.prescriptionID}%`,
      `%${prescriptions.dosage}%`,
      `%${prescriptions.quantity}%`,
      `%${prescriptions.insurance}%`,
      `%${prescriptions.medication}%`,
      `%${prescriptions.status}%`,
    ]);

    // Process the rows
    console.log("Prescription Report res:", rows);
    rows.forEach((row) => {
      console.log(
        `Prescription ID: ${row.prescriptionID}, Medication: ${row.medicationName}`
      );
      console.log(`Doctor: Dr. ${row.firstName} ${row.lastName}`);
      console.log(`Provider: ${row.providerName}`);
    });

    const renameKeys = (obj) => {
      // Convert the dateIssued field into a formatted date and time
      const dateIssued = new Date(obj.dateIssued);

      // Format the date to "YYYY-MM-DD"
      const formattedDate = dateIssued.toISOString().split("T")[0];

      // Format the time to "HH:mm"
      const formattedTime = dateIssued
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5);
      return {
        prescriptionID: String(obj.prescriptionID),
        medication: obj.medicationName,
        dosage: obj.dosage,
        quantity: String(obj.quantity),
        provider: `${obj.firstName} ${obj.lastName}`,
        insurance: obj.providerName,
        issued: `${formattedDate} ${formattedTime}`,
        status: obj.approvalStatus,
      };
    };

    // Apply the renaming function to each row
    const renamedRows = rows.map(renameKeys);

    return res.status(200).json({
      message: "Get Prescription Report Successful!",
      data: renamedRows,
    });
  } catch (error) {
    console.error("Error Fetching the prescription report: ", error);
    res
      .status(500)
      .json({ message: "Server error fetching prescription report" });
  }
}
