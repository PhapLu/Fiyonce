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
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <img style="width: 100px; height: auto; object-fit: cover" src="https://res.cloudinary.com/fiyonce/image/upload/v1721793532/fiyonce/system/email_logo_fqu2hq.png" alt="Pastal">
                </div>
                <div class="content">
                    <div class="content_container">
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                        <p class="content_head">Chào ${toEmail},</p>
                        <p>${message}</p>
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                        <div class="verification-code">${verificationCode}</div>
                        <p class="content_note">*Mã có hiệu lực trong vòng 30 phút.</p>
                    </div>
                </div>
                <div style='font-size: 15px;' class="footer">
                    <p>Pastal là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau.</p>
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <span>Hiện tại Pastal vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn.</span>
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <p class="footer_final_p">Hẹn gặp lại trên Pastal.</p>
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <p>Mọi thắc mắc và đóng góp vui lòng liên hệ <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <a style='color: #ff9027; font-size: 16px;' class="fiyonce_help" href="mailto:help@pastal.com">help@pastal.com</a></p>
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

const announcementTemplate = (subSubject, message) => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pastal Violation Request Notification</title>
        <style>
            .btn {
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 145px;
                padding: 6px 22px;
                background-color: #000;
                color: #fff;
                border-radius: 28px;
                text-decoration: none;
                font-size: 14px;
            }

            .btn:hover {
                background-color: #000000;
            }
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; font: 16px/1.5 Arial, Helvetica, sans-serif;">

        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 16px 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); margin-top: 30px;">
            <!-- Logo Section -->
            <div style="text-align: left; margin-bottom: 25px;">
                <img style="width: 100px; height: auto; object-fit: cover" src="https://res.cloudinary.com/ddcywkzto/image/upload/v1728996102/pastal_logo_qgsivy.png" alt="Pastal Logo"/>
            </div>

            <!-- Content Section -->
            <div class="content">
                <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                <p style="font-size: 20px; font-weight: 600; margin-bottom: 25px; color: black;">${subSubject}</p>
                <p style="font-size: 19px; color: black;">${message}</p>
                <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                <p style="color: #4D4D4D; font-size: 17px">Pastal Team chúc bạn có được trải nghiệm tốt nhất khi đặt commission trên nền tảng.</p>
                <a class="btn" href="https://pastal.app" style="color: white; text-decoration: none; display: inline-block; text-align: center;">
                    <span style="float: left; height: 30px; line-height: 30px">Xem hợp đồng</span>
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <img class='svg' src="https://res.cloudinary.com/fiyonce/image/upload/v1727946925/fiyonce/system/next-button-removebg-preview_wpy3xa.png" alt="Icon" style="float: right; width: 30px; height: 30px;">
                </a>

                <div style="margin-top: 30px; font-size: 14px; color: #4D4D4D; line-height: 1.5; font-style: italic;">
                    <hr>
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <p>Pastal là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau. Hiện tại Pastal vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn. Hẹn gặp lại trên Pastal.</p>
                    <p>Mọi thắc mắc và đóng góp vui lòng liên hệ <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <a href="mailto:pastal@gmail.com" style=" text-decoration: none;">pastal@gmail.com</a> hoặc <a href="#" style=" text-decoration: none;">Fanpage</a></p>
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
                padding: 16px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                margin-top: 30px;
            }

            .logo {
                text-align: left;
                margin-bottom: 25px;
            }

            .logo img {
                width: 100px;
            }

            .header {
                font-size: 20px;
                font-weight: 600;
                margin-top: 0px;
                margin-bottom: 25px;
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
                width: 60px;
                height: 60px;
                float: left;
                margin-right: 15px;
            }
            .order_scope{
                font-weight: 600;
                color: black;
            }
            .profile-card h2 {
                margin: 0;
                font-size: 18px;
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
                margin: 0;
            }
            .btn {
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 145px;
                padding: 6px 22px;
                background-color: #000;
                color: #fff;
                border-radius: 28px;
                text-decoration: none;
                font-size: 14px;
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
            .a3s {
                direction: ltr;
                font: 16px/1.5 Arial, Helvetica, sans-serif; /* Set font size to 16px */
                overflow-x: auto;
                overflow-y: hidden;
                position: relative;
            }
            .gt{
                font-size: 1rem
            }
            
        </style>
    </head>
    <body>

        <div class="container" style="font: 16px/1.5 Arial, Helvetica, sans-serif;">
            <!-- Logo Section -->
            <div class="logo">
                    <img style="width: 100px; height: auto; object-fit: cover" src="https://res.cloudinary.com/fiyonce/image/upload/v1721793532/fiyonce/system/email_logo_fqu2hq.png" alt="Pastal">
            </div>

            <!-- Content Section -->
            <div class="content">
                <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                <p class="header">${subSubject}</p>

                <!-- Profile Card -->
                <div class="profile-card" style="display: flex; flex-direction: column; flex-direction: column !important; display: block;">
                    <div class="profile-card-head">
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                        <img src="${user.avatar}" alt="Artist Avatar">
                        <div class="artist-info">
                            <h2>${user.fullName}</h2>
                            <p>@${user.stageName}</p>
                            <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                        </div>
                    </div>
                    <p class="order-details">
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                        ${price}<br>
                    </p>
                    <p class="order_scope">
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                        ${message}<br>
                    </p>
                    <p class="order_code">
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                        ${orderCode}
                    </p>
                </div>
                <p class="pastal_note">Pastal Team chúc bạn có được trải nghiệm tốt nhất khi đặt commission trên nền tảng.</p>

                <!-- Button -->
                <a class="btn" href="https://pastal.app" style="color: white; text-decoration: none; display: inline-block; text-align: center;">
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <span style="float: left; height: 30px; line-height: 30px">Xem hợp đồng</span>
                    <img class='svg' src="https://res.cloudinary.com/fiyonce/image/upload/v1727946925/fiyonce/system/next-button-removebg-preview_wpy3xa.png" alt="Icon" style="float: right; width: 30px; height: 30px;">
                </a>

                <!-- Footer -->
                <div class="footer">
                    <hr>
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <p>Pastal là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau. Hiện tại Pastal vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn. Hẹn gặp lại trên Pastal.</p>
                    <p>Mọi thắc mắc và đóng góp vui lòng liên hệ <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <a href="mailto:pastal@gmail.com">pastal@gmail.com</a> hoặc <a href="mailto:pastal@gmail.com">Fanpage</a></p>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/dist/boxicons.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css">
    </body>
    </html>
    `
}

const reportTemplate = (fullName, subSubject, message) => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pastal Violation Request Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; font: 16px/1.5 Arial, Helvetica, sans-serif;">

        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 16px 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); margin-top: 30px;">
            <!-- Logo Section -->
            <div style="text-align: left; margin-bottom: 25px;">
                <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <img style="width: 100px; height: auto; object-fit: cover" src="https://res.cloudinary.com/fiyonce/image/upload/v1721793532/fiyonce/system/email_logo_fqu2hq.png" alt="Pastal">
            </div>

            <!-- Content Section -->
            <div class="content">
                <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                <p style="font-size: 20px; font-weight: 600; margin-bottom: 25px; color: black;">${subSubject}</p>

                <div style="border: 1px solid #D9D9D9; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <div style="display: block; margin-bottom: 8px; color: #000000;">
                        <strong>Người gửi yêu cầu:</strong> ${fullName}
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    </div>
                    <div style="display: block; margin-bottom: 8px; color: #4D4D4D;">
                        <strong>Nội dung vi phạm:</strong> ${message}
                        <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    </div>
                </div>

                <p style="font-weight: bold; font-size: 18px">Pastal sẽ xử lí đơn tố cáo dựa trên điều khoản của nền tảng (1), điều khoản dịch vụ của họa sĩ (2) và thỏa thuận trong hợp đồng giữa hai bên (3). Rất mong khách hàng và họa sĩ cung cấp thêm các bằng chứng liên quan bằng cách trả lời bên dưới email này.</p>

                <div style="margin-top: 30px; font-size: 14px; color: #4D4D4D; line-height: 1.5; font-style: italic;">
                    <hr>
                    <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <p>Pastal là nền tảng vẽ tranh theo yêu cầu hàng đầu Việt Nam, nơi quy tụ những họa sĩ trẻ tài năng từ nhiều trường phái hội họa khác nhau. Hiện tại Pastal vẫn còn đang trong giai đoạn thử nghiệm, rất mong nhận được những đóng góp và ý kiến từ các bạn để sản phẩm cải thiện hơn. Hẹn gặp lại trên Pastal.</p>
                    <p>Mọi thắc mắc và đóng góp vui lòng liên hệ <span aria-hidden="true" style="display:none;">${new Date().getTime()}</span>
                    <a href="mailto:pastal@gmail.com" style=" text-decoration: none;">pastal@gmail.com</a> hoặc <a href="#" style=" text-decoration: none;">Fanpage</a></p>
                </div>
            </div>
        </div>

    </body>
    </html>
    `;
};

// Export or use these functions as needed
export { otpTemplate, announcementTemplate, commissionTemplate, reportTemplate };
