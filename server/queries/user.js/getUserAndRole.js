import { query } from "../../database.js"; // Import the query function
import {
  SELECT_ADMIN_FROM_EMAIL_QUERY,
  SELECT_DOCTOR_FROM_EMAIL_QUERY,
  SELECT_PATIENT_FROM_EMAIL_QUERY,
} from "../constants/selectQueries.js";

export async function getUserAndRole(email) {
  // Query the database to find the user by email in all tables (admin, patient, doctor)
  let user = await query(SELECT_ADMIN_FROM_EMAIL_QUERY, [email]);
  let role = "admin";

  if (user.length === 0) {
    user = await query(SELECT_PATIENT_FROM_EMAIL_QUERY, [email]);
    role = "patient";
  } else if (user.length === 0) {
    user = await query(SELECT_DOCTOR_FROM_EMAIL_QUERY, [email]);
    role = "doctor";
  } else if (user.length === 0) {
    // no user
    return [null, null];
  }

  return [user, role];
}
