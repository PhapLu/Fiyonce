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
        if (!user) throw new NotFoundError("User not found!");

        //2. Validate request body
        const { receiverId, type, url } = body;
        const receiver = await User.findById(receiverId);
        if (!receiverId) {
            throw new BadRequestError("Please provide all required fields");
        }
        if (!receiver) throw new NotFoundError("Receiver not found!");
        if (
            type !== "like" &&
            type !== "share" &&
            type !== "bookmark" &&
            type !== "follow" &&
            type !== "orderCommission" &&
            type !== "updateOrderStatus"
        ) {
            throw new BadRequestError("Invalid type");
        }

        //3. Assign content based on type of notification
        let content;
        let notificationType;
        switch (type) {
            case "like":
                content = `${user.fullName} liked your post`;
                notificationType = "interaction";
                break;
            case "share":
                content = `${user.fullName} shared your post`;
                notificationType = "interaction";
                break;
            case "bookmark":
                content = `${user.fullName} bookmarked your post`;
                notificationType = "interaction";
                break;
            case "follow":
                content = `${user.fullName} followed you`;
                notificationType = "interaction";
                break;
            case "orderCommission":
                content = `${user.fullName} ordered your commission`;
                notificationType = "order";
                break;
            case "updateOrderStatus":
                content = `${user.fullName} updated the status of your order`;
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

    static async readNotification(userId, body) {
        //1. Check user
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("User not found!");

        // Mark a single notification as seen
        const notification = await Notification.findByIdAndUpdate(
            {
                receiverId: userId,
                _id: body.notificationId
            },
            { isSeen: true },
            { new: true } // Return the updated document
        );

        if (!notification) {
            throw new NotFoundError('Notification not found');
        }

        return { notification };
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
