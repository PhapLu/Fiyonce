import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js"
import conversationController from '../../controllers/conversation.controller.js'
import { uploadFields } from '../../configs/multer.config.js'

const router = express.Router()

router.get('/readConversation/:conversationId', asyncHandler(conversationController.readConversation))
router.get('/readConversations', asyncHandler(conversationController.readConversations))

//authentication
router.use(verifyToken)

router.post('/createConversation', uploadFields, asyncHandler(conversationController.createConversation))
router.patch('/updateConversation/:conversationId', uploadFields, asyncHandler(conversationController.updateConversation))
router.delete('/deleteConversation/:conversationId', asyncHandler(conversationController.deleteConversation))

export default router
