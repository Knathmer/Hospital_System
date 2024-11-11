import { query } from "../../database.js";

export async function hasPersonalInfo(req, res) {
  try {
    const patientID = req.user.patientID;

    const GET_ADDRESS_ID_FROM_PATIENT = `SELECT addressID
                                            FROM patient
                                            WHERE patientID = ?;`;
    let addressID = await query(GET_ADDRESS_ID_FROM_PATIENT, [patientID]);
    addressID = addressID[0].addressID;

    const GET_PERSONAL_INFO_QUERY = `SELECT firstName, lastName, dateOfBirth, gender, email, phoneNumber
                                            FROM patient
                                            WHERE patientID = ?;`;
    const GET_PATIENT_ADDRESS_QUERY = `SELECT addrStreet, addrZip, addrCity, addrState
                                        FROM address
                                        WHERE addressID = ?;`;
    const GET_EMERGENCY_CONTACT_QUERY = `SELECT firstName, lastName, relationship, emergencyPhoneNumber, emergencyEmail
                                                FROM emergency_contact
                                                WHERE patientID = ?;`;

    const personalInfoResult = await query(GET_PERSONAL_INFO_QUERY, [
      patientID,
    ]);
    console.log("Personal Info result:", personalInfoResult);

    const patientAddressResult = await query(GET_PATIENT_ADDRESS_QUERY, [
      addressID,
    ]);
    console.log("addrID: ", addressID);
    console.log("Patient Address result:", patientAddressResult);

    const emergencyContactResult = await query(GET_EMERGENCY_CONTACT_QUERY, [
      patientID,
    ]);
    console.log("Emergency Contact result:", emergencyContactResult);

    return res.status(200).json({
      message: "Get Personal Info Successful!",
      data: [personalInfoResult, patientAddressResult, emergencyContactResult],
    });
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({
      message: "Server error fetching prescriptions",
    });
  }
}
