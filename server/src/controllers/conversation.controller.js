import { SuccessResponse } from "../core/success.response.js"
import ConversationService from "../services/conversation.service.js"

class ControllerController{
    createConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create service success!',
            metadata: await ConversationService.createConversation(req.userId, req)
        }).send(res)
    }

    readConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read service success!',
            metadata: await ConversationService.readConversation(req.params.conversationId)
        }).send(res)
    }

    readConversationWithOtherMember = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read service success!',
            metadata: await ConversationService.readConversationWithOtherMember(req.userId, req.params.otherMemberId)
        }).send(res)
    }

    readConversations = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read services success!',
            metadata: await ConversationService.readConversations(req.params.talentId)
        }).send(res)
    }

    updateConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update service success!',
            metadata: await ConversationService.updateConversation(req.userId, req.params.conversationId, req)
        }).send(res)
    }

    deleteConversation = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete service success!',
            metadata: await ConversationService.deleteConversation(req.userId, req.params.conversationId)
        }).send(res)
    }

}

export default new ControllerController()