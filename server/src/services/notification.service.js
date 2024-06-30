import Notification from '../models/notification.model.js'
import { User } from '../models/user.model.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from '../utils/cloud.util.js'

class NotificationService{ 
    static createNotification = async (senderId, body) => {
        //1. Check user
        const user = await User.findById(senderId)
        if (!user) throw new NotFoundError('User not found!')

        //2. Validate request body
        const {receiverId, content} = body
        if (!receiverId || !content) {
            throw new BadRequestError('Please provide all required fields')
        }

        //3. Create and save notification
        let notification = new Notification({
            receiverId,
            content,
            senderAvatar: user.avatar
        })
        await notification.save()

        return {
            notification
        }
    }
    
    static readNotification = async(notificationId) => {
        //1. Check notification
        const notification = await Notification.findById(notificationId)
        if (!notification) throw new NotFoundError('Notification not found!')

        return {
            notification
        }
    }
    

    static readNotifications = async(userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User not found!')

        //2. Get notifications
        const notifications = await Notification.find({receiverId: userId})

        return {
            notifications
        }
    }
}

export default NotificationService
