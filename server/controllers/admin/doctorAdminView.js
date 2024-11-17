// server/controllers/admin/doctorController.js

import { query } from "../../database.js";

export async function getAllDoctors(req, res) {
  try {
    const { searchTerm, includeInactive } = req.query;

    let sql = `
      SELECT d.*, s.specialtyName, o.officeName, a.addrStreet, a.addrzip, a.addrcity, a.addrstate
      FROM doctor d
      LEFT JOIN specialty s ON d.specialtyID = s.specialtyID
      LEFT JOIN office o ON d.officeID = o.officeID
      LEFT JOIN address a ON d.addressID = a.addressID
      WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
      sql += ` AND (d.firstName LIKE ? OR d.lastName LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
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
