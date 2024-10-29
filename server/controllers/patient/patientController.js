import { query } from "../../database.js";

export const getAllPharmacies = async (req, res) => {
  try {
    const allPharmacies = await query("SELECT * FROM pharmacy;");
    res.status(200).json({ allPharmacies });
  } catch (error) {
    console.error("Error fetching all pharmacies: ", error);
    res.status(500).json({ message: "Server error fetching all pharmacies" });
  }
};
