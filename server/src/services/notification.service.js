import Notification from "../models/notification.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"

class NotificationService {
    static createNotification = async (senderId, body) => {
        console.log("Create noti")
        console.log(body)
        //1. Check user
        const user = await User.findById(senderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Validate request body
        const { receiverId, type, url } = body
        const receiver = await User.findById(receiverId)
        if (!receiverId) {
            throw new BadRequestError("Hãy nhập đầy đủ những thông tin cần thiết")
        }
        if (!receiver) throw new NotFoundError("Không tìm thấy người nhận")

        if (senderId === receiverId) return

        //3. Assign content based on type of notification
        let content = '';
        let notificationType = '';
        switch (type) {
            case "like":
                content = `${user.fullName} đã thích bài viết của bạn`
                notificationType = "interaction"
                break
            case "share":
                content = `${user.fullName} chia sẻ bài viết của bạn`
                notificationType = "interaction"
                break
            case "bookmark":
                content = `${user.fullName} đã lưu bài viết của bạn`
                notificationType = "interaction"
                break
            case "follow":
                content = `${user.fullName} đã theo dõi bạn`;
                notificationType = "interaction";
                break;
            case "createCommissionOrder":
                content = `${user.fullName} đã đặt commission của bạn`;
                notificationType = "order";
                break;
            case "updateCommissionOrder":
                content = `${user.fullName} đã cập nhật thông tin đơn hàng`;
                notificationType = "order";
                break;
            case "approveCommissionOrder":
                content = `${user.fullName} đã tiếp nhận đơn hàng và gửi proposal cho bạn`;
                notificationType = "order";
                break;
            case "confirmCommissionOrder":
                content = `${user.fullName} đã thanh toán đơn hàng`;
                notificationType = "order";
                break;
            case "rejectCommissionOrder":
                content = `${user.fullName} đã từ chối yêu cầu commission của bạn`;
                notificationType = "order";
                break;
            case "startWipCommissionOrder":
                content = `${user.fullName} đã tiến hành thực hiện commission của bạn`;
                notificationType = "order";
                break;
            case "reportCommissionOrder":
                content = `${user.fullName} đã báo cáo vi phạm`;
                notificationType = "order";
                break;
            case "confirmTalentRequest":
                content = `Admin đã chấp nhận yêu cầu nâng cấp tài khoản của bạn`;
                notificationType = "system";
                break;
            case "denyTalentRequest":
                content = `Admin đã từ chối yêu cầu nâng cấp tài khoản của bạn`;
                notificationType = "system";
                break;
            default:
                throw new BadRequestError("Invalid type");
        }

        //3. Create and save notification
        let notification = new Notification({
            receiverId,
            content,
            type: notificationType,
            senderAvatar: user.avatar,
            url,
        })
        await notification.save()

        return {
            notification
        }
    }

    static async readNotification(userId, body) {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        // Mark a single notification as seen
        const notification = await Notification.findByIdAndUpdate(
            {
                receiverId: userId,
                _id: body.notificationId
            },
            { isSeen: true },
            { new: true } // Return the updated document
        )

        if (!notification) {
            throw new NotFoundError('Không tìm thấy thông báo')
        }

        return { notification }
    }

    static async readNotifications(userId) {
        // Mark multiple notifications as seen
        await Notification.updateMany(
            {
                receiverId: userId,
            },
            { isSeen: true },
            { new: true }
        )

        // Fetch the updated notifications
        const updatedNotifications = await Notification.find({
            receiverId: userId,
            isSeen: true
        }).sort({ createdAt: -1 })

        return { notifications: updatedNotifications }
    }
}

export default NotificationService
