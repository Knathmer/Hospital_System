import { getDoctorByEmail } from "./getDoctorByEmail.js";
import { getPatientByEmail } from "./getPatientByEmail.js";
import { getAdminByEmail } from "./getAdminByEmail.js";

export async function getUserAndRole(email) {
  try {
    // Query the database to find the user by email in all tables (admin, patient, doctor)
    let user = await getAdminByEmail(email);
    let role = "admin";
    let userIDField = "adminID";

    if (user === null) {
      // No user in admin, check patient table
      user = await getPatientByEmail(email);
      role = "patient";
      userIDField = "patientID";
    }
    if (user === null) {
      // No user in patient, check doctor table
      user = await getDoctorByEmail(email);
      role = "doctor";
      userIDField = "doctorID";
    }
    if (user === null) {
      // No user found in any table
      return [null, null, null];
    }

    return [user, role, userIDField];
  } catch (error) {
    console.error("Error fetching user:", error);
    return [null, null, null];
  }
}
