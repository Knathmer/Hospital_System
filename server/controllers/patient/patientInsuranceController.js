import { query } from "../../database.js";

export async function updateInsurance(req, res) {
  try {
    const patientID = req.user.id;
    const { ...insurData } = req.body;

    console.log(`providerName: ${insurData.providerName}`);
    console.log(`policyNum: ${insurData.policyNum}`);
    console.log(`covDetails: ${insurData.covDetails}`);
    console.log(`covExpDate: ${insurData.covExpDate}`);
    const UPDATE_INSURANCE_QUERY =
      "UPDATE insurance SET providerName = ?, policy_number = ?, coverageDetails = ?, coverage_expiration_date = ? WHERE patientID = ?";

    const update = await query(UPDATE_INSURANCE_QUERY, [
      insurData.providerName,
      insurData.policyNum,
      insurData.covDetails,
      insurData.covExpDate,
      patientID,
    ]);
    console.log("Patient update result:", update);

    return res.status(200).json({ message: "Update Insurance Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function postInsurance(req, res) {
  try {
    const patientID = req.user.id;
    const { ...insurData } = req.body;

    console.log(`providerName: ${insurData.providerName}`);
    console.log(`policyNum: ${insurData.policyNum}`);
    console.log(`covDetails: ${insurData.covDetails}`);
    console.log(`covExpDate: ${insurData.covExpDate}`);
    const INSERT_INSURANCE_QUERY =
      "INSERT INTO insurance (providerName, policy_number, coverageDetails, coverage_expiration_date, patientID) VALUES (?,?,?,?,?)";

    const insertResult = await query(INSERT_INSURANCE_QUERY, [
      insurData.providerName,
      insurData.policyNum,
      insurData.covDetails,
      insurData.covExpDate,
      patientID,
    ]);
    console.log("Patient insert result:", insertResult);

    return res.status(200).json({ message: "Insert Insurance Successful!" });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
}

export async function hasInsuranceInfo(req, res) {
  try {
    const patientID = req.user.id;
    const INSURANCE_EXISTANCE_QUERY =
      "SELECT * FROM insurance WHERE patientID = ?";

    const insertResult = await query(INSURANCE_EXISTANCE_QUERY, [patientID]);
    console.log("Patient select result:", insertResult);

    return res.status(200).json({
      message: "Get Insurance Successful!",
      data: insertResult,
    });
  } catch {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({
      message: "Server error fetching prescriptions",
    });
  }
}
