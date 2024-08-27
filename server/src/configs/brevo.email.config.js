import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { otpTemplate, announcementTemplate } from "../utils/templateEmail.util.js";

async function sendOtpEmail(to, subject, message, verificationCode) {
    const toEmail = to.replace("@gmail.com", "");
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: process.env.BREVO_SMTP_USERNAME,
                pass: process.env.BREVO_SMTP_PASSWORD,
            },
        });

        // Define the html form of the email
        const htmlContent = otpTemplate(toEmail, message, verificationCode);

        // Define the mail options
        const mailOptions = {
            from: '"Pastal" <phapluudev2k5@gmail.com>',
            to,
            subject,
            html: htmlContent,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP Email sent::", info.messageId);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
}
async function sendAnnouncementEmail(to, subject, message, reason) {
    const toEmail = to.replace("@gmail.com", "");
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: process.env.BREVO_SMTP_USERNAME,
                pass: process.env.BREVO_SMTP_PASSWORD,
            },
        });

        // Define the html form of the email
        const htmlContent = announcementTemplate(toEmail, message, reason);

        // Define the mail options
        const mailOptions = {
            from: '"Pastal" <phapluudev2k5@gmail.com>',
            to,
            subject,
            html: htmlContent,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Announcement Email sent::", info.messageId);
    } catch (error) {
        console.error("Error sending announcement email:", error);
    }
}

export {sendOtpEmail, sendAnnouncementEmail };
