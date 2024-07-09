import { SuccessResponse } from "../core/success.response.js"
import ConversationService from "../services/conversation.service.js"

class ControllerController{
    createConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create conversation success!',
            metadata: await ConversationService.createConversation(req.userId, req)
        }).send(res)
    }

    readConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read conversation success!',
            metadata: await ConversationService.readConversation(req.params.conversationId)
        }).send(res)
    }

    readConversationWithOtherMember = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read conversation success!',
            metadata: await ConversationService.readConversationWithOtherMember(req.userId, req.params.otherMemberId)
        }).send(res)
    }

    readConversations = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read conversations success!',
            metadata: await ConversationService.readConversations(req.userId)
        }).send(res)
    }
    
    sendMessage = async(req, res, next) => {
        new SuccessResponse({
            message: 'Send message success!',
            metadata: await ConversationService.sendMessage(req.userId, req.params.conversationId, req)
        }).send(res)
    }
}

export default new ControllerController()