import { query } from "../../database.js";

// Fetch all doctors
export async function getAllDoctors(req, res) {
  try {
    const doctors = await query('SELECT doctorID, firstName, lastName, workEmail, specialtyID, officeID, Inactive FROM doctor');
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

    // Insert new doctor
    const sql = `
      INSERT INTO doctor 
        (firstName, lastName, gender, dateOfBirth, workPhoneNumber, workEmail, password, personalPhoneNumber, personalEmail, officeID, addressID, specialtyID, Inactive, createdBy, updatedBy)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin', 'admin')
    `;
    const params = [
      firstName,
      lastName,
      gender,
      dateOfBirth,
      workPhoneNumber,
      workEmail,
      password, // In production, ensure password is hashed
      personalPhoneNumber,
      personalEmail,
      officeID || null,
      addressID || null,
      specialtyID || null,
      Inactive ? 1 : 0,
    ];

    const result = await query(sql, params);
    const newDoctorID = result.insertId;

    // Fetch the newly added doctor
    const newDoctor = await query('SELECT doctorID, firstName, lastName, workEmail, specialtyID, officeID, Inactive FROM doctor WHERE doctorID = ?', [newDoctorID]);

    res.status(201).json({ doctor: newDoctor[0] });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update an existing doctor
export async function updateDoctor(req, res) {
  try {
    const { doctorID } = req.params;
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      workPhoneNumber,
      workEmail,
      password, // If password is provided, update it
      personalPhoneNumber,
      personalEmail,
      officeID,
      addressID,
      specialtyID,
      Inactive,
    } = req.body;

    // Build dynamic SQL query
    let sql = 'UPDATE doctor SET ';
    const params = [];
    const updates = [];

    if (firstName) {
      updates.push('firstName = ?');
      params.push(firstName);
    }
    if (lastName) {
      updates.push('lastName = ?');
      params.push(lastName);
    }
    if (gender) {
      updates.push('gender = ?');
      params.push(gender);
    }
    if (dateOfBirth) {
      updates.push('dateOfBirth = ?');
      params.push(dateOfBirth);
    }
    if (workPhoneNumber) {
      updates.push('workPhoneNumber = ?');
      params.push(workPhoneNumber);
    }
    if (workEmail) {
      updates.push('workEmail = ?');
      params.push(workEmail);
    }
    if (password) {
      updates.push('password = ?');
      params.push(password); // In production, ensure password is hashed
    }
    if (personalPhoneNumber) {
      updates.push('personalPhoneNumber = ?');
      params.push(personalPhoneNumber);
    }
    if (personalEmail) {
      updates.push('personalEmail = ?');
      params.push(personalEmail);
    }
    if (officeID !== undefined) {
      updates.push('officeID = ?');
      params.push(officeID || null);
    }
    if (addressID !== undefined) {
      updates.push('addressID = ?');
      params.push(addressID || null);
    }
    if (specialtyID !== undefined) {
      updates.push('specialtyID = ?');
      params.push(specialtyID || null);
    }
    if (Inactive !== undefined) {
      updates.push('Inactive = ?');
      params.push(Inactive ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    // Always update the updater info
    updates.push('updatedBy = ?');
    params.push('admin'); // Replace with actual admin username if available

    updates.push('updatedAt = CURRENT_TIMESTAMP');

    sql += updates.join(', ') + ' WHERE doctorID = ?';
    params.push(doctorID);

    await query(sql, params);

    // Fetch the updated doctor
    const updatedDoctor = await query('SELECT doctorID, firstName, lastName, workEmail, specialtyID, officeID, Inactive FROM doctor WHERE doctorID = ?', [doctorID]);

    res.status(200).json({ doctor: updatedDoctor[0] });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a doctor
export async function deleteDoctor(req, res) {
  try {
    const { doctorID } = req.params;

    // Optionally, check for dependencies before deleting
    // For example, check if the doctor has appointments, etc.

    const sql = 'DELETE FROM doctor WHERE doctorID = ?';
    await query(sql, [doctorID]);

    res.status(200).json({ message: 'Doctor deleted successfully.' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
