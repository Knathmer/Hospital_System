import { query } from "../../database.js";

export async function getAllDoctors(req, res) {
  try {
    const { searchTerm, includeInactive } = req.query;

    let sql = `
      SELECT
        d.doctorID as doctorID,
        d.firstName as firstName,
        d.lastName as lastName,
        d.gender as gender,
        d.dateOfBirth as dateOfBirth,
        d.workPhoneNumber as workPhoneNumber,
        d.workEmail as workEmail,
        d.personalPhoneNumber as personalPhoneNumber,
        d.personalEmail as personalEmail,
        d.Inactive as Inactive,
        s.specialtyName as specialtyName,
        o.officeName as officeName,
        a.addrStreet as addrStreet,
        a.addrzip as addrZip,
        a.addrcity as addrCity,
        a.addrstate as addrState
      FROM doctor d
      LEFT JOIN specialty s ON d.specialtyID = s.specialtyID
      LEFT JOIN office o ON d.officeID = o.officeID
      LEFT JOIN address a ON d.addressID = a.addressID
      WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
      sql += ` AND (
        d.firstName LIKE ? OR
        d.lastName LIKE ? OR
        d.workEmail LIKE ? OR
        d.workPhoneNumber LIKE ?
      )`;
      const likeTerm = `%${searchTerm}%`;
      params.push(likeTerm, likeTerm, likeTerm, likeTerm);
    }

    if (!includeInactive || includeInactive === 'false') {
      sql += ` AND d.Inactive = 0`;
    }

    const doctors = await query(sql, params);
    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function inactivateDoctor(req, res) {
  try {
    const { doctorID } = req.params;

    // Set Inactive to 1
    await query(`UPDATE doctor SET Inactive = 1 WHERE doctorID = ?`, [doctorID]);

    res.status(200).json({ message: 'Doctor inactivated successfully' });
  } catch (error) {
    console.error('Error inactivating doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function reactivateDoctor(req, res) {
  try {
    const { doctorID } = req.params;

    // Set Inactive to 0
    await query(`UPDATE doctor SET Inactive = 0 WHERE doctorID = ?`, [doctorID]);

    res.status(200).json({ message: 'Doctor reactivated successfully' });
  } catch (error) {
    console.error('Error reactivating doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
