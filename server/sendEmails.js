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
        let [emails] = await query('SELECT * FROM email_queue WHERE status = "Pending"');

        // Ensure emails is always an array
        if (!Array.isArray(emails)) {
            emails = [emails]; // Convert single result to an array
        }

        for (let email of emails) {
            try {
                // Send the email
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email.recipientEmail,
                    subject: email.subject,
                    text: email.message
                });

                // Update the email status to 'Sent'
                await query('UPDATE email_queue SET status = "Sent" WHERE emailID = ?', [email.emailID]);
            } catch (err) {
                console.error(`Failed to send email to ${email.recipientEmail}:`, err);

                // Update the email status to 'Failed'
                await query('UPDATE email_queue SET status = "Failed" WHERE emailID = ?', [email.emailID]);
            }
        }
    } catch (error) {
        console.error('Error fetching or sending emails:', error);
    }
}

// Run the email sending function periodically (every hour), change to (sendPendingEmails, 60000) to run every minute, or (sendPendingEmails, 3600000) to run every hour
setInterval(sendPendingEmails, 3600000);
