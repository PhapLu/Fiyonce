import { SuccessResponse } from "../core/success.response.js"
import ConversationService from "../services/conversation.service.js"

class ControllerController{
    createConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tạo đoạn hội thoại thành công',
            metadata: await ConversationService.createConversation(req.userId, req)
        }).send(res)
    }

    readConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem đoạn hội thoại thành công',
            metadata: await ConversationService.readConversation(req.userId, req.params.conversationId)
        }).send(res)
    }

    readConversationWithOtherMember = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem đoạn hội thoại thành công',
            metadata: await ConversationService.readConversationWithOtherMember(req.userId, req.params.otherMemberId)
        }).send(res)
    }

    readConversations = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem các đoạn hội thoại thành công',
            metadata: await ConversationService.readConversations(req.userId)
        }).send(res)
    }
    
    sendMessage = async(req, res, next) => {
        new SuccessResponse({
            message: 'Gửi tin nhắn thành công',
            metadata: await ConversationService.sendMessage(req.userId, req.body.conversationId, req)
        }).send(res)
    }
}

export default new ControllerController()