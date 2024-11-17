import { query } from "../../database.js";
import {
  PRESCRIPTION_REPORT_QUERY,
  REFILL_REPORT_QUERY,
} from "../../queries/constants/reportQueries.js";

const groupRequestsByPatientAndMedication = (rows) => {
  return rows.reduce(
    (acc, { patientID, firstName, lastName, medicationName, requestDate }) => {
      // Create a unique key based on patientID, firstName, lastName, and medicationName
      const groupKey = `${patientID}-${firstName}-${lastName}-${medicationName}`;

      // Initialize the group if it doesn't exist in the accumulator
      if (!acc[groupKey]) {
        acc[groupKey] = {
          patientID,
          firstName,
          lastName,
          medicationName,
          requestCount: 0,
        };
      }

      // Increment the request count for this group
      acc[groupKey].requestCount += 1;

      // Return the accumulator
      return acc;
    },
    {}
  );
};

const groupRequestsByYear = (rows) => {
  return rows.reduce(
    (acc, { patientID, firstName, lastName, medicationName, requestDate }) => {
      // Format the date to YYYY (year only)
      const yearKey = `${requestDate.getFullYear()}`;

      // Create a unique key for the grouping based on year
      const groupKey = `${patientID}-${firstName}-${lastName}-${medicationName}-${yearKey}`;

      // Initialize the group if not already in the accumulator
      if (!acc[groupKey]) {
        acc[groupKey] = {
          patientID,
          firstName,
          lastName,
          medicationName,
          year: yearKey,
          requestCount: 0,
        };
      }

      // Increment the request count for this group
      acc[groupKey].requestCount += 1;

      return acc;
    },
    {}
  );
};

const groupRequestsByMonth = (rows) => {
  return rows.reduce(
    (acc, { patientID, firstName, lastName, medicationName, requestDate }) => {
      // Format the date to YYYY-MM
      const monthKey = `${requestDate.getFullYear()}-${(
        requestDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      // Create a unique key for the grouping
      const groupKey = `${patientID}-${firstName}-${lastName}-${medicationName}-${monthKey}`;

      // Initialize the group if not already in the accumulator
      if (!acc[groupKey]) {
        acc[groupKey] = {
          patientID,
          firstName,
          lastName,
          medicationName,
          month: monthKey,
          requestCount: 0,
        };
      }

      // Increment the request count for this group
      acc[groupKey].requestCount += 1;

      return acc;
    },
    {}
  );
};

export async function getPrescriptionReport(req, res) {
  try {
    console.log(req.query);
    const { prescriptions, refills } = req.query[0];
    const activeTab = req.query[1];

    let rows;
    let renamedRows;

    const renamePresKeys = (obj) => {
      let formattedDate = "";
      let formattedTime = "";

      if (obj.dateIssued !== "") {
        // Convert the dateIssued field into a formatted date and time
        const dateIssued = new Date(obj.dateIssued);

        // Format the date to "YYYY-MM-DD"
        formattedDate = dateIssued.toISOString().split("T")[0];

        // Format the time to "HH:mm"
        formattedTime = dateIssued.toTimeString().split(" ")[0].substring(0, 5);
      }

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

    const renameRefillKeys = (obj) => {
      // Convert the dateIssued field into a formatted date and time
      // const dateIssued = new Date(obj.dateIssued);

      // // Format the date to "YYYY-MM-DD"
      // const formattedDate = dateIssued.toISOString().split("T")[0];

      // // Format the time to "HH:mm"
      // const formattedTime = dateIssued
      //   .toTimeString()
      //   .split(" ")[0]
      //   .substring(0, 5);

      return {
        patientID: String(obj.patientID),
        medication: obj.medicationName,
        refillNumber: String(obj.requestCount),
        refillFrequency: String(obj.refillFrequency),
        provider: `${obj.firstName} ${obj.lastName}`,
      };
    };

    // let medFilter = filter.prescriptions;
    // medFilter = medFilter.medicationName;
    if (activeTab === "prescriptions") {
      console.log("filter backend: ", prescriptions);

      rows = await query(PRESCRIPTION_REPORT_QUERY, [
        `%${prescriptions.prescriptionID}%`,
        `%${prescriptions.dosage}%`,
        `%${prescriptions.quantity}%`,
        `%${prescriptions.insurance}%`,
        `%${prescriptions.medication}%`,
        `%${prescriptions.status}%`,
      ]);

      if (rows.length === 0) {
        // Define the structure of the object with empty values for each key you want to return
        rows = [
          {
            prescriptionID: "",
            medicationName: "",
            dosage: "",
            quantity: "",
            firstName: "",
            lastName: "",
            providerName: "",
            dateIssued: "",
            approvalStatus: "",
          },
        ];
      }

      // Process the rows
      console.log("Prescription Report res:", rows);
      rows.forEach((row) => {
        console.log(
          `Prescription ID: ${row.prescriptionID}, Medication: ${row.medicationName}`
        );
        console.log(`Doctor: Dr. ${row.firstName} ${row.lastName}`);
        console.log(`Provider: ${row.providerName}`);

        // Apply the renaming function to each row
        renamedRows = rows.map(renamePresKeys);
      });
    } else {
      console.log("filter backend: ", refills);

      let groupedRequests;

      rows = await query(REFILL_REPORT_QUERY, [
        `%${refills.patientID}%`,
        `%${refills.medication}%`,
      ]);

      if (rows.length === 0) {
        // Define the structure of the object with empty values for each key you want to return
        rows = [
          {
            patientID: "",
            medicationName: "",
            requestDate: "",
            firstName: "",
            lastName: "",
          },
        ];
      }

      // Process the rows
      console.log("Refill Report res:", rows);
      rows.forEach((row) => {
        console.log(
          `Patient ID: ${row.patientID}, Medication: ${row.medicationName}`
        );
        console.log(`Doctor: Dr. ${row.firstName} ${row.lastName}`);
        console.log(`Request Date: ${row.requestDate}`);
      });

      // Group and count by patientID, firstName, lastName, medicationName, and month
      if (rows.refillFrequency === "monthly" && rows.requestDate !== "") {
        groupedRequests = groupRequestsByMonth(rows);
      } else if (rows.refillFrequency === "yearly" && rows.requestDate !== "") {
        groupedRequests = groupRequestsByYear(rows);
      } else if (rows.requestDate !== "") {
        groupedRequests = groupRequestsByPatientAndMedication(rows);
      }

      // Convert the grouped object back into an array
      const result = Object.values(groupedRequests);

      console.log("result", result);

      // Apply the renaming function to each row
      renamedRows = result.map(renameRefillKeys);
      console.log("renamedRows", renamedRows);
    }

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
