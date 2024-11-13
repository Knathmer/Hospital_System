import { query } from "../../database.js";

export async function updatePatient(pInfo, patientID) {
  try {
    const UPDATE_PATIENT_PERSONAL_INFO = `UPDATE patient
                                            SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, email = ?, phoneNumber = ?
                                            WHERE patientID = ?;`;

    const updatePResult = await query(UPDATE_PATIENT_PERSONAL_INFO, [
      pInfo.firstName,
      pInfo.lastName,
      pInfo.dateOfBirth,
      pInfo.gender,
      pInfo.email,
      pInfo.phone,
      patientID,
    ]);

    console.log("Update Patient result:", updatePResult);
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({
      message: "Server error fetching prescriptions",
    });
  }
}

export async function updateAddress(pAddr, addressID) {
  try {
    const UPDATE_ADDRESS_PERSONAL_INFO = `UPDATE address
                                            SET addrStreet = ?, addrcity = ?, addrstate = ?, addrzip = ?
                                            WHERE addressID = ?;`;

    const updateAddrResult = await query(UPDATE_ADDRESS_PERSONAL_INFO, [
      pAddr.streetAddress,
      pAddr.city,
      pAddr.state,
      pAddr.zipCode,
      addressID,
    ]);

    console.log("Update Address result:", updateAddrResult);
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({
      message: "Server error fetching prescriptions",
    });
  }
}

export async function updateEmergencyContact(pEContact, patientID) {
  try {
    const UPDATE_ECONTACT_PERSONAL_INFO = `UPDATE emergency_contact
                                            SET firstName = ?, lastName = ?, relationship = ?, emergencyPhoneNumber = ?, emergencyEmail = ?
                                            WHERE patientID = ?;`;

    const updateEContact = await query(UPDATE_ECONTACT_PERSONAL_INFO, [
      pEContact.emergencyContactFirstName,
      pEContact.emergencyContactLastName,
      pEContact.emergencyContactRelationship,
      pEContact.emergencyContactPhone,
      pEContact.emergencyContactEmail,
      patientID,
    ]);

    console.log("Update Emergency Contact result:", updateEContact);
  } catch (error) {
    console.error("Error Fetching the prescriptions: ", error);
    res.status(500).json({
      message: "Server error fetching prescriptions",
    });
  }
}

export async function updatePersonalInfo(req, res) {
  try {
    const patientID = req.user.patientID;
    const { ...pInfoData } = req.body;

    const pInfo = {
      firstName: pInfoData.firstName,
      lastName: pInfoData.lastName,
      dateOfBirth: pInfoData.dateOfBirth,
      gender: pInfoData.gender,
      email: pInfoData.email,
      phone: pInfoData.phone,
    };

    const pAddr = {
      streetAddress: pInfoData.streetAddress,
      city: pInfoData.city,
      state: pInfoData.state,
      zipCode: pInfoData.zipCode,
    };

    const GET_ADDRESS_ID_FROM_PATIENT = `SELECT addressID
                                            FROM patient
                                            WHERE patientID = ?;`;
    let addressID = await query(GET_ADDRESS_ID_FROM_PATIENT, [patientID]);
    addressID = addressID[0].addressID;

    const pEContact = {
      emergencyContactFirstName: pInfoData.emergencyContactFirstName,
      emergencyContactLastName: pInfoData.emergencyContactLastName,
      emergencyContactRelationship: pInfoData.emergencyContactRelationship,
      emergencyContactPhone: pInfoData.emergencyContactPhone,
      emergencyContactEmail: pInfoData.emergencyContactEmail,
    };

    const updatePResult = await updatePatient(pInfo, patientID);
    const updateAddrResult = await updateAddress(pAddr, addressID);
    const updateEResult = await updateEmergencyContact(pEContact, patientID);
  } catch (error) {
    console.error("Error Updating Personal Info: ", error);
    res.status(500).json({
      message: "Server error updating personal info",
    });
  }
}

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
