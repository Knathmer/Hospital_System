import { bulkQuery, query } from "../../database.js";
import {
  INSERT_ALLERGY_QUERY,
  INSERT_DISABILITY_QUERY,
  INSERT_SURGERY_QUERY,
  INSERT_VACCINE_QUERY,
} from "../../queries/constants/insertQueries.js";

export async function hasMedicationInfo(patientID) {
  try {
    console.log("med");
    const MEDICATION_EXISTANCE_QUERY =
      "SELECT * FROM other_prescription WHERE patientID = ?";

    const result = await query(MEDICATION_EXISTANCE_QUERY, [patientID]);
    console.log("Patient select result:", result);

    return result;

    // return res.status(200).json({
    //   message: "Get Vaccine Successful!",
    //   data: result,
    // });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({
    //   message: "Server error fetching prescriptions",
    // });
  }
}

export async function hasSurgeryInfo(patientID) {
  try {
    console.log("sur");
    const SURGERY_EXISTANCE_QUERY = "SELECT * FROM surgery WHERE patientID = ?";

    const result = await query(SURGERY_EXISTANCE_QUERY, [patientID]);
    console.log("Patient select result:", result);

    return result;

    // return res.status(200).json({
    //   message: "Get Vaccine Successful!",
    //   data: result,
    // });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({
    //   message: "Server error fetching prescriptions",
    // });
  }
}

export async function hasDisabilityInfo(patientID) {
  try {
    console.log("dis");
    const DISABILITY_EXISTANCE_QUERY =
      "SELECT * FROM disability WHERE patientID = ?";

    const result = await query(DISABILITY_EXISTANCE_QUERY, [patientID]);
    console.log("Patient select result:", result);

    return result;

    // return res.status(200).json({
    //   message: "Get Vaccine Successful!",
    //   data: result,
    // });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({
    //   message: "Server error fetching prescriptions",
    // });
  }
}

export async function hasAllergyInfo(patientID) {
  try {
    console.log("all");
    const ALLERGY_EXISTANCE_QUERY = "SELECT * FROM allergy WHERE patientID = ?";

    const result = await query(ALLERGY_EXISTANCE_QUERY, [patientID]);
    console.log("Patient select result:", result);

    return result;

    // return res.status(200).json({
    //   message: "Get Vaccine Successful!",
    //   data: result,
    // });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({
    //   message: "Server error fetching prescriptions",
    // });
  }
}

export async function hasVaccineInfo(patientID) {
  try {
    console.log("vac");
    const VACCINE_EXISTANCE_QUERY = "SELECT * FROM vaccine WHERE patientID = ?";

    const result = await query(VACCINE_EXISTANCE_QUERY, [patientID]);
    console.log("Patient select result:", result);
    // Format the date in the result
    const formattedResult = result.map((vaccine) => {
      const dateAdministered = new Date(vaccine.dateAdministered);
      const formattedDate = dateAdministered.toISOString().split("T")[0]; // Gets the 'yyyy-MM-dd' part
      return {
        ...vaccine,
        dateAdministered: formattedDate,
      };
    });

    return formattedResult;

    // return res.status(200).json({
    //   message: "Get Vaccine Successful!",
    //   data: result,
    // });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({
    //   message: "Server error fetching prescriptions",
    // });
  }
}

export async function hasMedHistoryInfo(req, res) {
  try {
    const patientID = req.user.patientID;

    const vaccineInfo = await hasVaccineInfo(patientID);
    const allergyInfo = await hasAllergyInfo(patientID);
    const disabilityInfo = await hasDisabilityInfo(patientID);
    const surgeryInfo = await hasSurgeryInfo(patientID);
    const medicationInfo = await hasMedicationInfo(patientID);

    const response = [
      {
        vaccine: vaccineInfo,
        allergy: allergyInfo,
        disability: disabilityInfo,
        surgery: surgeryInfo,
        medication: medicationInfo,
      },
    ];
    console.log("response-med-info:", allergyInfo);

    return res.status(200).json({
      message: "Get Medical History Successful!",
      data: response,
    });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({
      message: "Server error fetching prescriptions",
    });
  }
}

export async function postAllergies(allergiesList, patientID) {
  try {
    const allergies = allergiesList.map((allergy) => [
      allergy.name,
      allergy.reaction,
      allergy.severity,
      patientID,
    ]);

    console.log(`allergies: ${allergies}`);
    const insertResult = await bulkQuery(INSERT_ALLERGY_QUERY, [allergies]);
    console.log("Patient insert result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function postDisabilities(disabilityList, patientID) {
  try {
    const disabilities = disabilityList.map((disability) => [
      disability.name,
      patientID,
    ]);
    console.log(`disabilities: ${disabilities}`);
    const insertResult = await bulkQuery(INSERT_DISABILITY_QUERY, [
      disabilities,
      patientID,
    ]);
    console.log("Patient insert result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function postMedications(medicationList, patientID) {
  try {
    const INSERT_MEDICATION_QUERY =
      "INSERT INTO other_prescriptions (medicationName, patientID) VALUES ?";

    const medications = medicationList.map((disability) => [
      disability.name,
      patientID,
    ]);
    console.log(`disabilities: ${medications}`);
    const insertResult = await bulkQuery(INSERT_MEDICATION_QUERY, [
      medications,
    ]);
    console.log("Patient insert medication result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function postVaccines(vaccineList, patientID) {
  try {
    const vaccines = vaccineList.map((vaccine) => [
      vaccine.name,
      vaccine.date,
      patientID,
      vaccine.doctor,
    ]);
    console.log(`vaccines: ${vaccines}`);
    const insertResult = await bulkQuery(INSERT_VACCINE_QUERY, [vaccines]);
    console.log("Patient insert result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function postSurgeries(surgeryList, patientID) {
  try {
    const surgeries = surgeryList.map((surgery) => [
      surgery.name,
      surgery.date,
      surgery.doctor,
      patientID,
    ]);
    console.log(`surgeries: ${surgeries}`);
    const insertResult = await bulkQuery(INSERT_SURGERY_QUERY, [surgery]);
    console.log("Patient insert result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function postMedicalHistory(req, res) {
  try {
    const patientID = req.user.patientID;
    const { ...medData } = req.body;
    const allergiesList = medData.allAllergies;
    const disabilityList = medData.allDisabilities;
    const vaccineList = medData.allVaccines;
    const surgeryList = medData.allSurgeries;

    if (allergiesList.length > 0) {
      postAllergies(allergiesList, patientID);
    }

    if (disabilityList.length > 0) {
      postDisabilities(disabilityList, patientID);
    }

    if (vaccineList.length > 0) {
      postVaccines(vaccineList, patientID);
    }

    if (surgeryList.length > 0) {
      postSurgeries(surgeryList, patientID);
    }

    return res
      .status(200)
      .json({ message: "Insert Medical History Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}
