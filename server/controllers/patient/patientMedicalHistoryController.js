import { bulkQuery } from "../../database.js";
import {
  INSERT_ALLERGY_QUERY,
  INSERT_DISABILITY_QUERY,
} from "../../queries/constants/insertQueries.js";

export async function postAllergies(allergiesList, patientID) {
  try {
    const allergies = allergiesList.map((allergy) => [
      allergy.name,
      allergy.reaction,
      allergy.severity,
      patientID,
    ]);

    console.log(`allergies: ${allergies}`);
    // const insertResult = await bulkQuery(INSERT_ALLERGY_QUERY, [allergies]);
    // console.log("Patient insert result:", insertResult);

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
    // const insertResult = await bulkQuery(INSERT_DISABILITY_QUERY, [
    //   disabilities,
    // ]);
    // console.log("Patient insert result:", insertResult);

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
      vaccine.doctor,
      patientID,
    ]);
    console.log(`vaccines: ${vaccines}`);
    // const insertResult = await bulkQuery(INSERT_VACCINE_QUERY, [
    //   vaccines,
    // ]);
    // console.log("Patient insert result:", insertResult);

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
    // const insertResult = await bulkQuery(INSERT_SURGERY_QUERY, [
    //   surgery,
    // ]);
    // console.log("Patient insert result:", insertResult);

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

    postAllergies(allergiesList, patientID);
    postDisabilities(disabilityList, patientID);
    postVaccines(vaccineList, patientID);
    postSurgeries(surgeryList, patientID);

    return res
      .status(200)
      .json({ message: "Insert Medical History Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}
