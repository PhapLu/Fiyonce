import Conversation from '../models/conversation.model.js'
import { User } from '../models/user.model.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from '../utils/cloud.util.js'

class ConversationService{ 
    static createConversation = async(userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new AuthFailureError('User not found')

        //2. Validate request body
        const { otherMemberId, content } = req.body
        if(!otherMemberId || !content) throw new BadRequestError('Please provide all required fields')
        if(content == '') throw new BadRequestError('Please provide content')

        //2. Create conversation
        const conversation = new Conversation({
            members: [{ user: userId }, { user: req.body.otherMemberId }],
            messages: [
                {
                    senderId: userId,
                    content: req.body.content,
                    createdAt: new Date(),
                },
            ],
        })

        await conversation.save()

        return {
            conversation
        }
    }

    static readConversations = async(userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new AuthFailureError('User not found')

        //2. Read conversations
        const conversations = await Conversation.find({ "members.user": userId }).populate('members.user', "fullName, avatar")
        const formattedConversations = conversations.map((conversation) => {
            let lastMessage = conversation.messages[conversation.messages.length - 1]
            let otherMember = conversation.members.find((member) => member.user._id.toString() !== userId)

            return {
                ...conversation._doc, // Include all other conversation properties
                otherMember: otherMember.user,
                lastMessage: lastMessage
            };
        })
        
        return {
            conversations : formattedConversations
        }
    }

    static readConversationWithOtherMember = async (userId, otherMemberId) => {
        //1. Check user and other member
        const user = await User.findById(userId);
        const otherMember = await User.findById(otherMemberId);
        if (!user) throw new AuthFailureError('User not found');
        if (!otherMember) throw new BadRequestError('Other member not found');
    
        //2. Read conversation
        const conversation = await Conversation.findOne({
            'members.user': { 
                $all: [
                    userId, 
                    otherMemberId
                ]
            }
        })
    
        if (!conversation) throw new NotFoundError('Conversation not found');
    
        return {
            conversation
        };
    };

    static readConversation = async(userId, conversationId) => {
        //1. Check conversation, user
        const user = await User.findById(userId)
        const conversation = await Conversation.findById(conversationId).populate('members.user', 'fullName avatar').populate('messages.senderId', "fullName avatar")
        if(!user) throw new AuthFailureError('User not found')  
        if(!conversation) throw new NotFoundError('Conversation not found')

        let formattedConversation
        const otherMember = conversation.members.find(
            (member) => member.user._id.toString() !== userId
        )
        formattedConversation = {
            _id: conversation._id,
            messages: conversation.messages,
            otherMember: otherMember.user,
        }
        return {
            conversation: formattedConversation
        }
    }
    static sendMessage = async(userId, conversationId, req) => {
        //1. Check user, conversation
        const user = await User.findById(userId)
        const conversation = await Conversation.findById(conversationId)
        if(!user) throw new AuthFailureError('User not found')
        if(!conversation) throw new NotFoundError('Conversation not found')

        //2. Send message
        let formattedConversation
        const otherMemberId = conversation.members.find(
            (member) => member.user._id.toString() !== userId
        )
        const otherMember = await User.findById(otherMemberId.user)
        conversation.messages.push({
            senderId: userId,
            content: req.body.content,
            createdAt: new Date(),
        })
        await conversation.save()
        
        //3. Format conversation
        formattedConversation = {
            _id: conversation._id,
            messages: conversation.messages,
            otherMember: {
                fullName: otherMember.fullName,
                avatar: otherMember.avatar
            },
        }

        return {
            conversation: formattedConversation
        }
    }
}

export default ConversationService
