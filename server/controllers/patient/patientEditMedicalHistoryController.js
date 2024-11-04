import { bulkQuery, query } from "../../database.js";

export async function updateAllergies(allergyList, patientID) {}

export async function updateDisabilities(disabilityList, patientID) {}

export async function updateVaccines(vaccineList, patientID) {}

export async function updateSurgeries(surgeryList, patientID) {}

export async function updateMedications(medicationList, patientID) {
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

export async function updateMedHistory(req, res) {
  try {
    const patientID = req.user.patientID;
    const { ...medData } = req.body;

    const allergiesList = medData.allAllergies;
    const disabilityList = medData.allDisabilities;
    const vaccineList = medData.allVaccines;
    const surgeryList = medData.allSurgeries;

    if (allergiesList.length > 0) {
      updateAllergies(allergiesList, patientID);
    }

    if (disabilityList.length > 0) {
      updateDisabilities(disabilityList, patientID);
    }

    if (vaccineList.length > 0) {
      updateVaccines(vaccineList, patientID);
    }

    if (surgeryList.length > 0) {
      updateSurgeries(surgeryList, patientID);
    }
    return res
      .status(200)
      .json({ message: "Update Medical History Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function removeAllergies(allergyList, patientID) {
  try {
    console.log("disabilityList: ", allergyList);
    const allergies = allergyList.map((allergy) => allergy.name);

    const placeholders = allergies.map(() => "?").join(",");
    console.log("placeholders: ", placeholders);
    console.log("pID: ", patientID);

    const REMOVE_ALLERGY_QUERY = `
    DELETE FROM allergy 
    WHERE allergen IN (${placeholders}) 
    AND patientID = ?;`;

    console.log("Delete Allergy parameters:", [...allergies, patientID]);

    const insertResult = await bulkQuery(REMOVE_ALLERGY_QUERY, [
      ...allergies,
      patientID,
    ]);
    console.log("Allergy delete result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function removeDisabilities(disabilityList, patientID) {
  try {
    console.log("disabilityList: ", disabilityList);
    const disabilities = disabilityList.map((disability) => disability.name);

    const placeholders = disabilities.map(() => "?").join(",");
    console.log("placeholders: ", placeholders);
    console.log("pID: ", patientID);

    const REMOVE_DISABILITY_QUERY = `
    DELETE FROM disability 
    WHERE disabilityType IN (${placeholders}) 
    AND patientID = ?;`;

    console.log("Delete Disability parameters:", [...disabilities, patientID]);

    const insertResult = await bulkQuery(REMOVE_DISABILITY_QUERY, [
      ...disabilities,
      patientID,
    ]);
    console.log("Disability delete result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function removeVaccines(vaccineList, patientID) {
  try {
    console.log("vaccineList: ", vaccineList);
    const vaccines = vaccineList.map((vaccine) => vaccine.name);

    const placeholders = vaccines.map(() => "?").join(",");
    console.log("placeholders: ", placeholders);
    console.log("pID: ", patientID);

    const REMOVE_VACCINE_QUERY = `
    DELETE FROM vaccine 
    WHERE vaccineName IN (${placeholders}) 
    AND patientID = ?;`;

    console.log("Delete Vaccine parameters:", [...vaccines, patientID]);

    const insertResult = await bulkQuery(REMOVE_VACCINE_QUERY, [
      ...vaccines,
      patientID,
    ]);
    console.log("Vaccine delete result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function removeSurgeries(surgeryList, patientID) {
  try {
    console.log("surgeryList: ", surgeryList);
    const surgeries = surgeryList.map((surgery) => surgery.name);

    const placeholders = surgeries.map(() => "?").join(",");
    console.log("placeholders: ", placeholders);
    console.log("pID: ", patientID);

    const REMOVE_SURGERY_QUERY = `
    DELETE FROM surgery 
    WHERE surgeryType IN (${placeholders}) 
    AND patientID = ?;`;

    console.log("Delete Surgery parameters:", [...surgeries, patientID]);

    const insertResult = await bulkQuery(REMOVE_SURGERY_QUERY, [
      ...surgeries,
      patientID,
    ]);
    console.log("Surgery delete result:", insertResult);

    // return res.status(200).json({ message: "Insert Allergies Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    // res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function removeMedHistory(req, res) {
  try {
    const patientID = req.user.patientID;
    const { ...medData } = req.body;

    const allergiesList = medData.removedAllergies;
    const disabilityList = medData.removedDisabilities;
    const vaccineList = medData.removedVaccines;
    const surgeryList = medData.removedSurgeries;

    if (allergiesList.length > 0) {
      removeAllergies(allergiesList, patientID);
    }

    if (disabilityList.length > 0) {
      removeDisabilities(disabilityList, patientID);
    }

    if (vaccineList.length > 0) {
      await removeVaccines(vaccineList, patientID);
    }

    if (surgeryList.length > 0) {
      removeSurgeries(surgeryList, patientID);
    }
    return res
      .status(200)
      .json({ message: "Remove Medical History Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}
