const otpTemplate = (toEmail, message, verificationCode) => {
    return `
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
                .content_head {
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
                .footer_final_p {
                    margin: 0;
                }
                .fiyonce_help {
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
                    <img src="https://res.cloudinary.com/fiyonce/image/upload/v1721793532/fiyonce/system/email_logo_fqu2hq.png" alt="Pastal">
                </div>
                <div class="content">
                    <div class="content_container">
                        <p class="content_head">Chào ${toEmail},</p>
                        <p>${message}</p>
                        <div class="verification-code">${verificationCode}</div>
                        <p class="content_note">*Mã có hiệu lực trong vòng 30 phút.</p>
                    </div>
                </div>
                <div style='font-size: 15px;' class="footer">
                    <p>Pastal là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau.</p>
                    <span>Hiện tại Pastal vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn.</span>
                    <p class="footer_final_p">Hẹn gặp lại trên Pastal.</p>
                    <p>Mọi thắc mắc và đóng góp vui lòng liên hệ <a style='color: #ff9027; font-size: 16px;' class="fiyonce_help" href="mailto:help@pastal.com">help@pastal.com</a></p>
                    <!-- <div class="social-icons">
                        <a href="#" target="_blank" style='margin-right:12px;'><img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718068817/fiyonce/system/facebook_icon_sk9jnu.png" style="object-fit: cover; border-radius:0px;display:block" class="CToWUd" data-bit="iit" /></a>
                        <a href="#" target="_blank" style='margin-right:12px;'><img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718064053/fiyonce/system/tiktok_icon_zkvjzu.png" style="border-radius:0px;display:block" width="22" class="CToWUd" data-bit="iit"/></a>
                        <a href="#" target="_blank" style='margin-right:12px;'><img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718064137/fiyonce/system/instagram_icon_lzz8ox.png" style="border-radius:0px;display:block" width="22" class="CToWUd" data-bit="iit"/></a>
                        <a href="#" target="_blank" style='margin-right:12px;'><img height="22" src="https://res.cloudinary.com/fiyonce/image/upload/v1718064187/fiyonce/system/pinterest_icon_xjzzls.png" style="border-radius:0px;display:block" width="22" class="CToWUd" data-bit="iit"/></a>
                    </div> -->
                </div>
            </div>
        </body>
        </html>
    `;
};

const announcementTemplate = (toEmail, message, orderCode, reason) => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pastal Violation Request Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 5px 40px;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                margin-top: 30px;
            }
    
            .logo {
                text-align: left;
                margin-bottom: 35px;
            }
    
            .header {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 25px;
                color: black;
            }
    
            .violation-card {
                display: flex;
                flex-direction: column;
                border: 1px solid #D9D9D9;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
            }
    
            .violation-card p {
                margin: 8px 0;
                color: #000000;
            }
    
            .violation-card span {
                font-weight: bold;
            }
    
            .violation-card h2 {
                margin: 0;
                font-size: 16px;
                color: black;
            }
    
            .violation-details {
                color: black;
            }
    
            .violation-description {
                margin-top: 8px;
                color: #4D4D4D;
            }
    
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #4D4D4D;
                line-height: 1.5;
                font-style: italic;
            }
    
            .pastal_note {
                color: #4D4D4D;
            }
    
            .footer a {
                text-decoration: none;
                color: #4D4D4D;
            }
    
            .footer a:hover {
                text-decoration: underline;
            }
            #:ow{
                font: Arial,Helvetica,sans-serif !important;
            }
        </style>
    </head>
    <body>
    
        <div class="container">
            <!-- Logo Section -->
            <div class="logo">
                <h1>Pastal.</h1>
            </div>
    
            <!-- Content Section -->
            <div class="content">
                <p class="header">Admin đã tiếp nhận yêu cầu xử lí vi phạm</p>
    
                <!-- Violation Card -->
                <div class="violation-card">
                    <p class="violation-details"><span>Người gửi yêu cầu:</span>${toEmail}</p>
                    <p class="violation-description"><span>Nội dung vi phạm:</span>${message}</p>
                </div>
    
                <!-- Note -->
                <p class="pastal_note">Pastal Team chúc bạn có được trải nghiệm tốt nhất khi đặt commission trên nền tảng.</p>
    
                <!-- Footer -->
                <div class="footer">
                    <hr>
                    <p>Pastal là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau. Hiện tại Pastal vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn. Hẹn gặp lại trên Pastal.</p>
                    <p>Mọi thắc mắc và đóng góp vui lòng liên hệ <a href="mailto:pastal@gmail.com">pastal@gmail.com</a> hoặc <a href="#">Fanpage</a></p>
                </div>
            </div>
        </div>
    
    </body>
    </html>    
    `;
};

const commissionTemplate = (user, message, subSubject, orderCode, price) => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pastal Commission Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 5px 40px;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                margin-top: 30px;
            }

            .logo {
                text-align: left;
                margin-bottom: 35px;
            }

            .logo img {
                width: 100px;
            }

            .header {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 35px;
                color: black;
            }

            .profile-card {
                display: flex;
                flex-direction: column;
                border: 1px solid #D9D9D9;
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 20px;
                text-align: left;
            }
            .profile-card-head{
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .profile-card img {
                border-radius: 50%;
                width: 70px;
                height: 70px;
                float: left;
                margin-right: 15px;
            }
            .order_scope{
                font-weight: 600;
                color: black;
            }
            .profile-card h2 {
                margin: 0;
                font-size: 16px;
                color: #000000;
            }
            .profile-card p {
                margin: 8px 0;
                color: black;
            }

            .order-details {
                color: black;
                margin-top: 15px;
            }

            .order-details span {
                font-weight: bold;
                color: #e74c3c;
            }
            .artist-info p{
                color: #4D4D4D;
            }
            .btn {
                display: flex;
                font-weight: bold;
                align-items: center;
                justify-content: space-between;
                width: 125px;
                padding: 12px 28px;
                background-color: #000;
                color: #fff;
                border-radius: 28px;
                text-decoration: none;
                font-size: 14px;
                margin-bottom: 40px;
            }
            .order_code{
                font-weight: bold;
            }
            .code{
                color: #e74c3c;
            }

            .btn:hover {
                background-color: #000000;
            }
            svg{
                width: 20px;
                height: 20px;
            }

            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #4D4D4D;
                line-height: 1.5;
                font-style: italic;
            }

            .pastal_note{
                color: #4D4D4D;
                margin-left: 5px;
            }

            .footer a {
                text-decoration: none;
            }

            .footer a:hover {
                text-decoration: underline;
            }
            body .a3s p, body .a3s {
                font-family: Arial, Helvetica, sans-serif !important;
            }
            .gt{
                font-size: 1rem
            }
            
        </style>
    </head>
    <body>

        <div class="container">
            <!-- Logo Section -->
            <div class="logo">
                <h1>Pastal.</h1>
            </div>

            <!-- Content Section -->
            <div class="content">
                <p class="header">${subSubject}</p>

                <!-- Profile Card -->
                <div class="profile-card" style="display: flex; flex-direction: column; flex-direction: column !important; display: block;">
                    <div class="profile-card-head">
                        <img src="${user.avatar}" alt="Artist Avatar">
                        <div class="artist-info">
                            <h2>${user.fullName}</h2>
                            <p>@${user.stageName}</p>
                        </div>
                    </div>
                    <p class="order-details">
                        ${price}<br>
                    </p>
                    <p class="order_scope">
                        ${message}<br>
                    </p>
                    <p class="order_code">
                        ${orderCode}
                    </p>
                </div>
                <p class="pastal_note">Pastal Team chúc bạn có được trải nghiệm tốt nhất khi đặt commission trên nền tảng.</p>

                <!-- Button -->
                <a href="#" style="color: white" class="btn">Xem hợp đồng <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
                </a>
                <!-- Footer -->
                <div class="footer">
                    <hr>
                    <p>Pastal là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau. Hiện tại Pastal vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn. Hẹn gặp lại trên Pastal.</p>
                    <p>Mọi thắc mắc và đóng góp vui lòng liên hệ <a href="mailto:pastal@gmail.com">pastal@gmail.com</a> hoặc <a href="mailto:pastal@gmail.com">Fanpage</a></p>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/dist/boxicons.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css">
    </body>
    </html>
    `
}

// Export or use these functions as needed
export { otpTemplate, announcementTemplate, commissionTemplate };
