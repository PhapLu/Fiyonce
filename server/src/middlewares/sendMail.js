import dotenv from 'dotenv';
dotenv.config()
import nodemailer from 'nodemailer';
import {google} from 'googleapis';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client =  new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendEmail(to, subject, message) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        // Create a transporter using
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'phapluudev2k5@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        //Define the html form of the email
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body>
            <div>
                <h1 style="color: blue;">${subject}</h1>
                <p>${message}</p>
            </div>
        </body>
        </html>
        `;
        // Define the email options
        const mailOptions = {
            from: '"Fiyonce" <phapluudev2k5@gmail.com>',
            to,
            subject,
            html: htmlContent
        };
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export default sendEmail;
