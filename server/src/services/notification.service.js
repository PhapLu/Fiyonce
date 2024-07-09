import Notification from '../models/notification.model.js'
import { User } from '../models/user.model.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'

class NotificationService{ 
    static createNotification = async (senderId, body) => {
        //1. Check user
        const user = await User.findById(senderId)
        if (!user) throw new NotFoundError('User not found!')

        //2. Validate request body
        const {receiverId, content, type} = body
        if (!receiverId || !content) {
            throw new BadRequestError('Please provide all required fields')
        }
        if(type !== 'like' && type !== 'share' && type !== 'bookmark'&& type !== 'follow' && type !== 'orderCommission' && type !== 'updateOrderStatus'){
            throw new BadRequestError('Invalid type')
        }
        
        //3. Assign content based on type of notification
        let notificationType
        switch(type){
            case 'like':
                content = `${user.name} liked your post`
                notificationType = 'interaction'
                break
            case 'share':
                content = `${user.name} shared your post`
                notificationType = 'interaction'
                break
            case 'bookmark':
                content = `${user.name} bookmarked your post`
                notificationType = 'interaction'
                break
            case 'follow':
                content = `${user.name} followed you`
                notificationType = 'interaction'
                break
            case 'orderCommission':
                content = `${user.name} ordered your commission`
                notificationType = 'order'
                break
            case 'updateOrderStatus':
                content = `${user.name} updated the status of your order`
                notificationType = 'order'
                break
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
