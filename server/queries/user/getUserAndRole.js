import { getDoctorByEmail } from "./getDoctorByEmail.js";
import { getPatientByEmail } from "./getPatientByEmail.js";
import { getAdminByEmail } from "./getAdminByEmail.js";

export async function getUserAndRole(email) {
  // Query the database to find the user by email in all tables (admin, patient, doctor)
  let user = await getAdminByEmail(email);
  let role = "admin";
  let userIDField = "adminID";

  if (user === null) {
    // No user in admin
    user = await getPatientByEmail(email);
    role = "patient";
    userIDField = "patientID";
  } else if (user === null) {
    // No user in patient
    user = await getDoctorByEmail(email);
    role = "doctor";
    userIDField = "doctorID";
  } else if (user === null) {
    // No user
    return [null, null, null];
  }

  return [user, role, userIDField];
}
