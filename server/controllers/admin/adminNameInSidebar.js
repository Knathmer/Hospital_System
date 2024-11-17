import { query } from "../../database.js";
import pool from "../../database.js"
import { SELECT_ADMIN_NAMES } from "../../queries/constants/selectQueries.js";

export async function welcomeAdminName(req, res) {
    const adminID = req.user.adminID;

    try {
        const [rows] = await pool.query(SELECT_ADMIN_NAMES, [adminID]);
        if (rows.length > 0) {
            const { firstName, lastName } = rows[0];
            res.status(200).json({firstName, lastName});
        }
        else {
            res.status(404).json({error: "Admin not found"});
        }
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
}