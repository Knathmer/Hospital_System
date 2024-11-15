const PRESCRIPTION_REPORT_QUERY = `SELECT 
                                        pres.prescriptionID, 
                                        pres.medicationName, 
                                        pres.dosage, 
                                        pres.quantity, 
                                        d.firstName, 
                                        d.lastName, 
                                        i.providerName
                                    FROM 
                                        prescription pres
                                    JOIN 
                                        patient pat ON pres.patientID = pat.patientID
                                    JOIN
                                        insurance i ON pat.patientID = i.patientID
                                    JOIN
                                        doctor d ON pres.doctorID = d.doctorID; `;

const REFILL_REPORT_QUERY = `SELECT
                                pres.patientID,
                                pres.medicationName,
                                refill,
                                doctorName
                            FROM 
                                prescription pres
                            JOIN

                                ;`;
