import pool from "../database.js";
const officeController = {};

export async function getOfficeLocations(req, res) {
    try {
      const [offices] = await pool.query("SELECT officeID, officeName FROM Office");
      res.status(200).json(offices);
    } catch (error) {
      console.error("Error fetching office locations:", error);
      res.status(500).json({ message: "Failed to fetch office locations" });
    }
  };
