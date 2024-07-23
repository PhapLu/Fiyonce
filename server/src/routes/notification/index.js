import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js"
import notificationController from '../../controllers/notification.controller.js'
import { uploadFields } from '../../configs/multer.config.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.post('/createNotification', asyncHandler(notificationController.createNotification))
router.patch('/readNotification/:notificationId', asyncHandler(notificationController.readNotification))
router.patch('/readNotifications', asyncHandler(notificationController.readNotifications))

export default router
