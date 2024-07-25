import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { announcementTemplate, otpTemplate } from "../utils/templateEmail.util";

async function brevoSendEmail(to, subject, subjectMessage, verificationCode, message, template) {
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
        let htmlContent
        if(template === 'otpTemplate'){
            htmlContent = otpTemplate(toEmail, subjectMessage, verificationCode);
        }else if(template === 'announcementTemplate'){
            htmlContent = announcementTemplate(toEmail, message);
        }

        //Define the mail options
        const mailOptions = {
            from: '"Pastal" <phapluudev2k5@gmail.com>',
            to,
            subject,
            html: htmlContent,
        };
        //Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent::", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export default brevoSendEmail;
