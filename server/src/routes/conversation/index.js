import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js"
import conversationController from '../../controllers/conversation.controller.js'
import { uploadFields } from '../../configs/multer.config.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.post('/createConversation', uploadFields, asyncHandler(conversationController.createConversation))
router.get('/readConversationWithOtherMember/:otherMemberId', asyncHandler(conversationController.readConversationWithOtherMember))
router.get('/readConversations', asyncHandler(conversationController.readConversations))
router.patch('/sendMessage', uploadFields, asyncHandler(conversationController.sendMessage))
router.get('/fetchOlderMessages', asyncHandler(conversationController.fetchOlderMessages))

export default router
