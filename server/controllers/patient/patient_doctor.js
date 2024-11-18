// server/controllers/patient/patient_doctor.js

import express from 'express';
import { query } from '../../database.js'; // Adjust the path as necessary
import { verifyTokenTemp } from '../../middleware/auth.js'; // Ensure the path is correct

const router = express.Router();

// GET /auth/patient/doctors - Get all active doctors
router.get('/doctors', verifyTokenTemp, async (req, res) => {
  try {
    const doctors = await query(`
      SELECT doctorID, firstName, lastName, specialtyID, workEmail, workPhoneNumber
      FROM doctor
      WHERE Inactive = 0
    `);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /auth/patient/assigned - Get doctors assigned to the patient
router.get('/assigned', verifyTokenTemp, async (req, res) => {
  const patientID = req.user.id; // Assuming verifyToken sets req.user.id
  try {
    const assignedDoctors = await query(`
      SELECT d.doctorID, d.firstName, d.lastName, d.specialtyID, d.workEmail, d.workPhoneNumber, pd.startDate, pd.isPrimary
      FROM doctor d
      JOIN patient_doctor pd ON d.doctorID = pd.doctorID
      WHERE pd.patientID = ?
    `, [patientID]);

    res.json(assignedDoctors);
  } catch (error) {
    console.error('Error fetching assigned doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/patient/assign - Assign a doctor to the patient
router.post('/assign', verifyTokenTemp, async (req, res) => {
  const patientID = req.user.id;
  const { doctorID, isPrimary } = req.body;

  if (!doctorID) {
    return res.status(400).json({ error: 'doctorID is required' });
  }

  try {
    // Check if the doctor exists and is active
    const doctor = await query(`
      SELECT * FROM doctor WHERE doctorID = ? AND Inactive = 0
    `, [doctorID]);

    if (doctor.length === 0) {
      return res.status(404).json({ error: 'Doctor not found or inactive' });
    }

    // If setting as primary, ensure no other primary exists
    if (isPrimary) {
      const existingPrimary = await query(`
        SELECT * FROM patient_doctor
        WHERE patientID = ? AND isPrimary = 1
      `, [patientID]);

      if (existingPrimary.length > 0) {
        return res.status(400).json({ error: 'Primary care provider already set' });
      }
    }

    // Check if the doctor is already assigned
    const alreadyAssigned = await query(`
      SELECT * FROM patient_doctor
      WHERE patientID = ? AND doctorID = ?
    `, [patientID, doctorID]);

    if (alreadyAssigned.length > 0) {
      return res.status(400).json({ error: 'Doctor already assigned to patient' });
    }

    // Assign the doctor
    await query(`
      INSERT INTO patient_doctor (patientID, doctorID, startDate, isPrimary)
      VALUES (?, ?, NOW(), ?)
    `, [patientID, doctorID, isPrimary ? 1 : 0]);

    res.status(201).json({ message: 'Doctor assigned successfully' });
  } catch (error) {
    console.error('Error assigning doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /auth/patient/remove/:doctorID - Remove an assigned doctor
router.delete('/remove/:doctorID', verifyTokenTemp, async (req, res) => {
  const patientID = req.user.id;
  const { doctorID } = req.params;

  try {
    // Check if the doctor is assigned
    const assignedDoctor = await query(`
      SELECT * FROM patient_doctor
      WHERE patientID = ? AND doctorID = ?
    `, [patientID, doctorID]);

    if (assignedDoctor.length === 0) {
      return res.status(404).json({ error: 'Doctor not assigned to patient' });
    }

    // Prevent removing the primary care provider without assigning a new one
    if (assignedDoctor[0].isPrimary) {
      return res.status(400).json({ error: 'Cannot remove primary care provider. Assign a new primary before removing.' });
    }

    // Remove the assignment
    await query(`
      DELETE FROM patient_doctor
      WHERE patientID = ? AND doctorID = ?
    `, [patientID, doctorID]);

    res.json({ message: 'Doctor removed successfully' });
  } catch (error) {
    console.error('Error removing doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
