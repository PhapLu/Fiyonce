import Notification from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";

class NotificationService {
    static createNotification = async (senderId, body) => {
        console.log(body)
        //1. Check user
        const user = await User.findById(senderId);
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");

        //2. Validate request body
        const { receiverId, type, url } = body;
        const receiver = await User.findById(receiverId);
        if (!receiverId) {
            throw new BadRequestError("Hãy cung cấp đầy đủ những mục bắt buộc");
        }
        if (!receiver) throw new NotFoundError("Không tìm thấy người nhận");
        if (
            type !== "like" &&
            type !== "share" &&
            type !== "bookmark" &&
            type !== "follow" &&
            type !== "orderCommission" &&
            type !== "updateOrderStatus"
        ) {
            throw new BadRequestError("Phân loại thông báo không hợp lệ");
        }

        //3. Assign content based on type of notification
        let content;
        let notificationType;
        switch (type) {
            case "like":
                content = `${user.fullName} đã thích bài viết của bạn`;
                notificationType = "interaction";
                break;
            case "share":
                content = `${user.fullName} đã chia sẻ bài viết của bạn`;
                notificationType = "interaction";
                break;
            case "bookmark":
                content = `${user.fullName} đã lưu bài viết của bạn`;
                notificationType = "interaction";
                break;
            case "follow":
                content = `${user.fullName} đã bắt đầu theo dõi bạn`;
                notificationType = "interaction";
                break;
            case "orderCommission":
                content = `${user.fullName} đã đặt com của bạn`;
                notificationType = "order";
                break;
            case "updateOrderStatus":
                content = `${user.fullName} đã cập nhật trạng thái đơn hàng của bạn`;
                notificationType = "order";
                break;
        }

        //3. Create and save notification
        let notification = new Notification({
            receiverId,
            content,
            type: notificationType,
            senderAvatar: user.avatar,
            url,
        });
        await notification.save();

        return {
            notification
        }
    }

    static async readNotification(userId, notificationId) {
        //1. Check user
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");

        //2. Mark a single notification as seen
        const notification = await Notification.findByIdAndUpdate(
            {
                notificationId
            },
            { isSeen: true },
            { new: true }
        );

        if (!notification) 
            throw new NotFoundError('Thông báo không tồn tại');

        return { 
            notification 
        };
    }

    static async readNotifications(userId) {
        // Mark multiple notifications as seen
        await Notification.updateMany(
            {
                receiverId: userId,
            },
            { isSeen: true },
            { new: true }
        );

        // Fetch the updated notifications
        const updatedNotifications = await Notification.find({
            receiverId: userId,
            isSeen: true
        });

        return { notifications: updatedNotifications };
    }
}

export default NotificationService;
