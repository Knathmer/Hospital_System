// server/controllers/admin/doctorController.js

import { query } from '../../database.js';

// Fetch all doctors with optional search and filters
export async function getAllDoctors(req, res) {
  try {
    const searchQuery = req.query.search || '';
    const specialtyFilter = req.query.specialty || '';
    const inactiveFilter = req.query.inactive || '';

    let sql = `
      SELECT d.doctorID, d.firstName, d.lastName, d.workEmail, d.workPhoneNumber, d.Inactive,
          sp.specialtyName, 
          CONCAT(addr.addrStreet, ', ', addr.addrcity, ', ', addr.addrstate, ' ', addr.addrzip) AS officeAddress
      FROM doctor d
      LEFT JOIN specialty sp ON d.specialtyID = sp.specialtyID
      LEFT JOIN office o ON d.officeID = o.officeID
      LEFT JOIN address addr ON o.addressID = addr.addressID
      WHERE CONCAT(d.firstName, ' ', d.lastName) LIKE ?
    `;
    const params = [`%${searchQuery}%`];

    if (specialtyFilter) {
      sql += ' AND sp.specialtyName = ?';
      params.push(specialtyFilter);
    }

    if (inactiveFilter) {
      sql += ' AND d.Inactive = ?';
      params.push(inactiveFilter);
    }

    const doctors = await query(sql, params);

    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Add a new doctor
export async function addDoctor(req, res) {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      workPhoneNumber,
      workEmail,
      password,
      personalPhoneNumber,
      personalEmail,
      officeID,
      addressID,
      specialtyID,
      Inactive,
    } = req.body;

    // Hash the password (implement hashing in your actual code)
    const hashedPassword = password; // Replace with actual hashing

    const sql = `
      INSERT INTO doctor (
        firstName, lastName, gender, dateOfBirth, workPhoneNumber, workEmail, password,
        personalPhoneNumber, personalEmail, officeID, addressID, specialtyID, Inactive, createdBy, updatedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      firstName,
      lastName,
      gender,
      dateOfBirth,
      workPhoneNumber,
      workEmail,
      hashedPassword,
      personalPhoneNumber,
      personalEmail,
      officeID,
      addressID,
      specialtyID,
      Inactive,
      req.user.email || 'system', // Assuming you have user info
      req.user.email || 'system',
    ];

    await query(sql, params);

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update an existing doctor
export async function updateDoctor(req, res) {
  try {
    const doctorID = req.params.doctorID;
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      workPhoneNumber,
      workEmail,
      personalPhoneNumber,
      personalEmail,
      officeID,
      addressID,
      specialtyID,
      Inactive,
    } = req.body;

    const sql = `
      UPDATE doctor SET
        firstName = ?,
        lastName = ?,
        gender = ?,
        dateOfBirth = ?,
        workPhoneNumber = ?,
        workEmail = ?,
        personalPhoneNumber = ?,
        personalEmail = ?,
        officeID = ?,
        addressID = ?,
        specialtyID = ?,
        Inactive = ?,
        updatedBy = ?
      WHERE doctorID = ?
    `;

    const params = [
      firstName,
      lastName,
      gender,
      dateOfBirth,
      workPhoneNumber,
      workEmail,
      personalPhoneNumber,
      personalEmail,
      officeID,
      addressID,
      specialtyID,
      Inactive,
      req.user.email || 'system',
      doctorID,
    ];

    await query(sql, params);

    res.status(200).json({ message: 'Doctor updated successfully' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a doctor
export async function deleteDoctor(req, res) {
  try {
    const doctorID = req.params.doctorID;

    const sql = `DELETE FROM doctor WHERE doctorID = ?`;
    const params = [doctorID];

    await query(sql, params);

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
