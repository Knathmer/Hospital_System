export const PRESCRIPTION_REPORT_QUERY = `SELECT 
                                        p.prescriptionID, 
                                        p.medicationName, 
                                        p.dosage, 
                                        p.quantity, 
                                        d.firstName, 
                                        d.lastName, 
                                        i.providerName
                                    FROM 
                                        prescription AS p
                                    JOIN
                                        doctor AS d ON p.doctorID = d.doctorID
                                    JOIN 
                                        patient AS pat ON p.patientID = pat.patientID
                                    JOIN
                                        insurance AS i ON pat.patientID = i.patientID
                                    WHERE 
                                        p.prescriptionID IS NOT NULL 
                                        AND p.activeStatus = 'Active'
                                        AND p.prescriptionID LIKE ?
                                        AND p.dosage LIKE ?
                                        AND p.quantity LIKE ?
                                        AND i.providerName LIKE ?
                                        AND p.medicationName LIKE ?;
                                         
                                     `;

const REFILL_REPORT_QUERY = `SELECT
                                pres.patientID,
                                pres.medicationName,
                                refill,
                                doctorName
                            FROM 
                                prescription pres
                            JOIN

                                ;`;
