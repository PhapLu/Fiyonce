import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

async function sendEmailSES(to, subject, subjectMessage, verificationCode) {
    const toEmail = to.replace('@gmail.com', '')
    try {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: 'email-smtp.ap-southeast-1.amazonaws.com',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: process.env.SMTP_USERNAME, // your Gmail username
        pass: process.env.SMTP_PASSWORD  // your Gmail password
      }
    });

    // Define the HTML content of the email
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 600px;
                    margin: 0 auto;
                    border: 1px solid #ccc;
                    padding: 20px;
                    border-radius: 10px;
                    background-color: #fff;
                }
                .header {
                    text-align: left;
                }
                .header img {
                    width: 100px;
                }
                .content {
                    background-image: url('https://res.cloudinary.com/fiyonce/image/upload/v1717646501/fiyonce/system/email_cover_kgziwd.jpg');
                    background-size: cover;
                    text-align: center;
                    margin-top: 20px;
                    padding: 20px;
                    font-size: 20px;
                    border-radius: 10px;
                    font-weight: bold;
                }
                .content_container {
                    background-color: white;
                    padding: 5px 30px;
                    text-align: left;
                    border-radius: 10px;
                    display: inline-block;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                }
                .verification-code {
                    font-size: 28px;
                    font-weight: bold;
                    margin: 16px 0;
                    text-align: center;
                }
                .content_head{
                    font-weight: bold;
                }
                .content_note {
                    font-size: 14px;
                }
                .footer {
                    margin-top: 20px;
                    text-align: left;
                    
                    font-weight: 400;
                }
                .footer_final_p{
                    margin: 0;
                }
                .fiyonce_help{
                    color: #ff9027;
                    text-decoration: none;
                    font-weight: bold;
                    
                }
                .social-icons {
                    display: flex;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/fiyonce/image/upload/v1717647058/fiyonce/system/email_logo_aedc4w.png" alt="Pastal">
                </div>
                <div class="content">
                    <div class="content_container">
                        <p class="content_head">Chào ${toEmail},</p>
                        <p>${subjectMessage}</p>
                        <div class="verification-code">${verificationCode}</div>
                        <p class="content_note">*Mã có hiệu lực trong vòng 30 phút.</p>
                    </div>
                </div>
                <div style='font-size: 15px;' class="footer">
                    <p>Fiyonce là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau.</p>
                    <span>Hiện tại Fiyonce vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn.</span>
                    <p class="footer_final_p">Hẹn gặp lại trên Fiyonce.</p>
                    <p>Mọi thắc mắc và đóng góp xin vui lòng liên hệ <a style='color: #ff9027; font-size: 16px;' class="fiyonce_help" href="mailto:help@fiyonce.com">help@fiyonce.com</a></p>
                    <div class="social-icons">
                        <a href="#" target="_blank" style='margin-right:12px;' > <img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718068817/fiyonce/system/facebook_icon_sk9jnu.png" style="object-fit: cover; border-radius:0px;display:block" class="CToWUd" data-bit="iit" /></a>
                        <a href="#" target="_blank" style='margin-right:12px;' ><img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718064053/fiyonce/system/tiktok_icon_zkvjzu.png" style="border-radius:0px;display:block" width="22" class="CToWUd" data-bit="iit"/></a>
                        <a href="#" target="_blank" style='margin-right:12px;' ><img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718064137/fiyonce/system/instagram_icon_lzz8ox.png" style="border-radius:0px;display:block" width="22" class="CToWUd" data-bit="iit"/></a>
                        <a href="#" target="_blank" style='margin-right:12px;' ><img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718064187/fiyonce/system/pinterest_icon_xjzzls.png" style="border-radius:0px;display:block" width="22" class="CToWUd" data-bit="iit"/></a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

    // Define the email options
    const mailOptions = {
      from: '"Your Name" <phapluudev2k5@gmail.com>',
      to,
      subject,
      html: htmlContent
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendEmailSES;
