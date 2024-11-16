import { query } from "../../database.js";

// Get Appointment Statistics
export const getAppointmentStatistics = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                status AS AppointmentStatus,
                visitType AS VisitType,
                COUNT(*) AS TotalAppointments
            FROM appointment
            GROUP BY status, visitType
            ORDER BY status, visitType;
        `);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching appointment statistics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Doctor Workload
export const getDoctorWorkload = async (req, res) => {
    try {
        const workloadResult = await query(`
            SELECT 
                d.doctorID,
                CONCAT(d.firstName, ' ', d.lastName) AS DoctorName,
                COUNT(a.appointmentID) AS TotalAppointments
            FROM doctor d
            LEFT JOIN appointment a ON d.doctorID = a.doctorID
            GROUP BY d.doctorID, DoctorName
            ORDER BY TotalAppointments DESC;
        `);

        const hoursWorkedResult = await query(`
            SELECT 
                d.doctorID,
                CONCAT(d.firstName, ' ', d.lastName) AS DoctorName,
                SUM(TIMESTAMPDIFF(HOUR, a.appointmentDateTime, a.updatedAt)) AS TotalHoursWorked
            FROM doctor d
            LEFT JOIN appointment a ON d.doctorID = a.doctorID
            WHERE a.status = 'Completed'
            GROUP BY d.doctorID, DoctorName
            ORDER BY TotalHoursWorked DESC;
        `);

        res.status(200).json({ workload: workloadResult, hoursWorked: hoursWorkedResult });
    } catch (error) {
        console.error("Error fetching doctor workload:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
