import { SuccessResponse } from "../core/success.response.js"
import NotificationService from "../services/notification.service.js"

class NotificationController{
    createNotification = async(req, res, next) => {
        console.log(req.userId)
        console.log(req.body)
        new SuccessResponse({
            message: 'Create notification success!',
            metadata: await NotificationService.createNotification(req.userId, req.body)
        }).send(res)
    }

    readNotification = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read notification success!',
            metadata: await NotificationService.readNotification(req.userId, req.body)
        }).send(res)
    }

    readNotifications = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read notifications success!',
            metadata: await NotificationService.readNotifications(req.userId, req.body)
        }).send(res)
    }
}

export default new NotificationController()