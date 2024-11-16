export const PRESCRIPTION_REPORT_QUERY = `SELECT 
                                        p.prescriptionID, 
                                        p.medicationName, 
                                        p.dosage, 
                                        p.quantity,
                                        p.dateIssued, 
                                        d.firstName, 
                                        d.lastName, 
                                        i.providerName,
                                        ia.approvalStatus
                                    FROM 
                                        prescription AS p
                                    JOIN
                                        doctor AS d ON p.doctorID = d.doctorID
                                    JOIN 
                                        patient AS pat ON p.patientID = pat.patientID
                                    JOIN
                                        insurance AS i ON pat.patientID = i.patientID
                                    JOIN 
                                        insurance_approval AS ia ON p.prescriptionID = ia.prescriptionID
                                    WHERE 
                                        p.prescriptionID IS NOT NULL 
                                        AND p.activeStatus = 'Active'
                                        AND p.prescriptionID LIKE ?
                                        AND p.dosage LIKE ?
                                        AND p.quantity LIKE ?
                                        AND i.providerName LIKE ?
                                        AND p.medicationName LIKE ?
                                        AND ia.approvalStatus LIKE ?;
                                         
                                     `;

export const REFILL_REPORT_QUERY = `SELECT
                                pres.patientID,
                                pres.medicationName,
                                r.requestDate,
                                d.firstName,
                                d.lastName
                            FROM 
                                prescription pres
                            JOIN
                                refill AS r ON pres.prescriptionID = r.prescriptionID
                            JOIN 
                                doctor AS d ON r.doctorID = d.doctorID
                            WHERE
                                pres.patientID LIKE ?
                                AND pres.medicationName LIKE ?
                                

                                ;`;
