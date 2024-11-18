import { query } from "./database.js"; // Use the existing query function
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',  // Or any email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send pending emails
async function sendPendingEmails() {
    try {
        // Retrieve pending emails from email_queue
        const emails = await query('SELECT * FROM email_queue WHERE status = "Pending"');

        // Check if there are any pending emails
        if (!Array.isArray(emails) || emails.length === 0) {
            console.log("No pending emails to send at this time.");
            return;
        }

        // Process each email
        for (const email of emails) {
            try {
                // Fetch appointment details along with related patient, doctor, specialty, office, and address information
                const [appointmentDetails] = await query(`
                    SELECT
                        appointment.appointmentID,
                        appointment.appointmentDateTime,
                        patient.firstName AS patientFirstName,
                        patient.lastName AS patientLastName,
                        patient.email AS patientEmail,
                        doctor.firstName AS doctorFirstName,
                        doctor.lastName AS doctorLastName,
                        doctor.workPhoneNumber,
                        doctor.workEmail,
                        specialty.specialtyName,
                        office.officeName,
                        office.officePhoneNumber,
                        address.addrStreet,
                        address.addrcity,
                        address.addrstate,
                        address.addrzip
                    FROM
                        appointment
                    JOIN patient ON appointment.patientID = patient.patientID
                    LEFT JOIN doctor ON appointment.doctorID = doctor.doctorID
                    LEFT JOIN specialty ON doctor.specialtyID = specialty.specialtyID
                    LEFT JOIN office ON appointment.officeID = office.officeID
                    LEFT JOIN address ON office.addressID = address.addressID
                    WHERE appointment.appointmentID = ?
                `, [email.appointmentID]);

                // Check if appointment details were retrieved successfully
                if (!appointmentDetails) {
                    console.error(`No appointment details found for appointmentID ${email.appointmentID}`);
                    await query('UPDATE email_queue SET status = "Failed" WHERE queueID = ?', [email.queueID]);
                    continue;
                }

                // Extract and format necessary data
                const patientName = `${appointmentDetails.patientFirstName} ${appointmentDetails.patientLastName}`;
                const recipientEmail = appointmentDetails.patientEmail;
                const appointmentDateTime = new Date(appointmentDetails.appointmentDateTime);
                const appointmentDate = appointmentDateTime.toLocaleDateString();
                const appointmentTime = appointmentDateTime.toLocaleTimeString();
                const doctorName = `${appointmentDetails.doctorFirstName} ${appointmentDetails.doctorLastName}`;
                const specialty = appointmentDetails.specialtyName || 'Healthcare Specialist';
                const officeAddress = `${appointmentDetails.addrStreet}, ${appointmentDetails.addrcity}, ${appointmentDetails.addrstate} ${appointmentDetails.addrzip}`;
                const doctorPhone = appointmentDetails.workPhoneNumber || 'N/A';
                const doctorEmail = appointmentDetails.workEmail || 'N/A';

                let subject = '';
                let message = '';

                // Construct the email based on the emailType
                if (email.emailType === 'Confirmation') {
                    subject = 'Appointment Confirmation with WomenWell';
                    message = `
Dear ${patientName},

We are pleased to confirm your appointment at WomenWell. Below are the details of your scheduled appointment:

Appointment Details:

Date: ${appointmentDate}
Time: ${appointmentTime}
Doctor: Dr. ${doctorName}, ${specialty}
Location: ${officeAddress}

If you need to make any changes to your appointment or require additional information, please contact Dr. ${doctorName} at ${doctorPhone} or email them at ${doctorEmail}.

Please arrive at least 5 minutes early and bring any necessary documents, such as your insurance card and identification.

We look forward to seeing you!
                    `;
                } else if (email.emailType === 'Cancellation') {
                    subject = 'Appointment Cancellation with WomenWell';
                    message = `
Dear ${patientName},

We regret to inform you that your appointment at WomenWell has been canceled. Below are the details of the canceled appointment:

Canceled Appointment Details:

Date: ${appointmentDate}
Time: ${appointmentTime}
Doctor: Dr. ${doctorName}, ${specialty}
Location: ${officeAddress}

We sincerely apologize for any inconvenience this may cause. If you would like to reschedule your appointment, please contact Dr. ${doctorName} at ${doctorPhone} or email them at ${doctorEmail}.

If you have any urgent concerns or need immediate assistance, please don’t hesitate to reach out to us.

Thank you for your understanding. We look forward to assisting you soon.
                    `;
                } else {
                    console.error(`Unknown emailType '${email.emailType}' for queueID ${email.queueID}`);
                    await query('UPDATE email_queue SET status = "Failed" WHERE queueID = ?', [email.queueID]);
                    continue;
                }

                // Send the email
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: recipientEmail,
                    subject: subject,
                    text: message.trim()
                });

                // Update the email status to 'Sent' and set sentAt timestamp
                await query('UPDATE email_queue SET status = "Sent", sentAt = NOW() WHERE queueID = ?', [email.queueID]);
            } catch (err) {
                console.error(`Failed to send email for queueID ${email.queueID}:`, err);

                // Update the email status to 'Failed'
                await query('UPDATE email_queue SET status = "Failed" WHERE queueID = ?', [email.queueID]);
            }
        }
    } catch (error) {
        console.error('Error fetching or sending emails:', error);
    }
}

// Run the email sending function periodically (every hour)
setInterval(sendPendingEmails, 3600000); // Run every hour