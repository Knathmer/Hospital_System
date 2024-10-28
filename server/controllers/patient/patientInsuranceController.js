import { query } from "../../database.js";

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
