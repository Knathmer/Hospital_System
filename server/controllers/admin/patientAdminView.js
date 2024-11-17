import { query } from "../../database.js";

export async function getAllPatients(req, res) {
  try {
    const { searchTerm, includeInactive } = req.query;

    let sql = `
      SELECT
        p.patientID as patientID,
        p.firstName as firstName,
        p.lastName as lastName,
        p.gender as gender,
        p.dateOfBirth as dateOfBirth,
        p.phoneNumber as phoneNumber,
        p.email as email,
        p.Inactive as Inactive,
        a.addrStreet as addrStreet,
        a.addrzip as addrZip,
        a.addrcity as addrCity,
        a.addrstate as addrState
      FROM patient p
      LEFT JOIN address a ON p.addressID = a.addressID
      WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
      sql += ` AND (p.firstName LIKE ? OR p.lastName LIKE ? OR p.email LIKE ? OR p.phoneNumber LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (!includeInactive || includeInactive === 'false') {
      sql += ` AND p.Inactive = 0`;
    }

    const patients = await query(sql, params);
    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function inactivatePatient(req, res) {
  try {
    const { patientID } = req.params;

    // Set Inactive to 1
    await query(`UPDATE patient SET Inactive = 1 WHERE patientID = ?`, [patientID]);

    res.status(200).json({ message: 'Patient inactivated successfully' });
  } catch (error) {
    console.error('Error inactivating patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function reactivatePatient(req, res) {
  try {
    const { patientID } = req.params;

    // Set Inactive to 0
    await query(`UPDATE patient SET Inactive = 0 WHERE patientID = ?`, [patientID]);

    res.status(200).json({ message: 'Patient reactivated successfully' });
  } catch (error) {
    console.error('Error reactivating patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
