export async function getAllDoctors(req, res) {
  try {
    const doctors = await query(`
      SELECT 
        d.doctorID,
        d.firstName,
        d.lastName,
        d.gender,
        d.dateOfBirth,
        d.workPhoneNumber,
        d.workEmail,
        d.personalPhoneNumber,
        d.personalEmail,
        d.officeID,
        d.addressID,
        d.specialtyID,
        s.specialtyName,
        d.Inactive
      FROM doctor d
      LEFT JOIN specialty s ON d.specialtyID = s.specialtyID
    `);

    res.status(200).json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Internal server error" });
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
    } = req.body;

    // Store the password directly (Note: In production, always hash passwords)
    const result = await query(
      `
      INSERT INTO doctor (
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
        createdBy,
        updatedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        firstName,
        lastName,
        gender,
        dateOfBirth,
        workPhoneNumber,
        workEmail,
        password,
        personalPhoneNumber,
        personalEmail,
        officeID || null,
        addressID || null,
        specialtyID || null,
        req.user.email, // Assuming you have user info in req.user
        req.user.email,
      ]
    );

    res.status(201).json({ message: "Doctor added successfully", doctorID: result.insertId });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ error: "Internal server error" });
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
      personalPhoneNumber,
      personalEmail,
      officeID,
      addressID,
      specialtyID,
      Inactive,
    } = req.body;

    await query(
      `
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
    `,
      [
        firstName,
        lastName,
        gender,
        dateOfBirth,
        workPhoneNumber,
        workEmail,
        personalPhoneNumber,
        personalEmail,
        officeID || null,
        addressID || null,
        specialtyID || null,
        Inactive ? 1 : 0,
        req.user.email,
        doctorID,
      ]
    );

    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a doctor
export async function deleteDoctor(req, res) {
  try {
    const { doctorID } = req.params;

    await query(`DELETE FROM doctor WHERE doctorID = ?`, [doctorID]);

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}