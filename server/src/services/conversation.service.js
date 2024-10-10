import Conversation from "../models/conversation.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import {
    compressAndUploadImage,
    deleteFileByPublicId,
    extractPublicIdFromUrl,
} from "../utils/cloud.util.js"

class ConversationService {
    static createConversation = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Validate request body
        const { otherMemberId, content } = req.body
        if (!otherMemberId)
            throw new BadRequestError("Hãy nhập đầy đủ những thông tin cần thiết")
        if (!content && (!req.files.media || req.file.media.length == 0))
            throw new BadRequestError("Hãy gửi tin nhắn hoặc ảnh")

        //3. Upload media
        try {
            let media = []

            if (req.files && req.files.media) {
                const uploadPromises = req.files.media.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/conversations/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                media = uploadResults.map((result) => result.secure_url)
            }

            //4. Create conversation
            const conversation = new Conversation({
                members: [{ user: userId }, { user: req.body.otherMemberId }],
                messages: [
                    {
                        senderId: userId,
                        content,
                        createdAt: new Date(),
                        media,
                    },
                ],
            })
            await conversation.save()

            return {
                conversation,
            }
        } catch (error) {
            console.log("Error uploading images:", error)
            throw new Error("File upload or database save failed")
        }
    }

    static readConversations = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Read conversations
        const conversations = await Conversation.find({
            "members.user": userId,
        }).populate("members.user", "fullName avatar").sort({ updatedAt: -1 })
        const formattedConversations = conversations.map((conversation) => {
            let lastMessage =
                conversation.messages[conversation.messages.length - 1]
            let otherMember = conversation.members.find(
                (member) => member.user._id.toString() !== userId
            )

            return {
                ...conversation._doc, // Include all other conversation properties
                otherMember: otherMember.user,
                lastMessage: lastMessage,
            }
        })

        return {
            conversations: formattedConversations,
        }
    }

    static readConversationWithOtherMember = async (userId, otherMemberId) => {
        try {
            // 1. Check user and other member
            const user = await User.findById(userId)
            const otherMember = await User.findById(otherMemberId)
            if (!user) throw new AuthFailureError("Bạn cần đăng nhập để thực hiện thao tác này")
            if (!otherMember) throw new BadRequestError("Có lỗi xảy ra")

            // 2. Read conversation
            const conversation = await Conversation.findOne({
                "members.user": {
                    $all: [userId, otherMemberId],
                },
            }).populate("members.user", "fullName avatar")

            if (!conversation) throw new NotFoundError("Không tìm thấy đoạn hội thoại")

            // 3. Mark all messages from otherMember as seen
            let updated = false
            conversation.messages.forEach(message => {
                if (message.senderId.toString() !== userId && !message.isSeen) {
                    message.isSeen = true
                    updated = true
                }
            })

            if (updated) {
                await conversation.save()
            }

            // 4. Format conversation
            const sortedMessages = conversation.messages
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 10)
                .reverse() // Reverse to maintain ascending order

            const formattedConversation = {
                _id: conversation._id,
                messages: sortedMessages,
                otherMember: {
                    _id: otherMember._id,
                    fullName: otherMember.fullName,
                    avatar: otherMember.avatar,
                },
            }

            return {
                conversation: formattedConversation,
            }

        } catch (error) {
            console.error("Error in readConversationWithOtherMember:", error)
            throw new Error("Failed to read conversation")
        }
    }

    // Route: GET /conversation/fetchOlderMessages
    static fetchOlderMessages = async (userId, req) => {
        console.log("ppp")
        console.log(req.query)
        const { conversationId, beforeMessageId, limit } = req.query;

        try {
            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            const index = conversation.messages.findIndex(msg => msg._id.toString() === beforeMessageId);
            const olderMessages = conversation.messages.slice(Math.max(index - limit, 0), index);

            console.log(olderMessages)
            return { messages: olderMessages.reverse() }
            // return res.status(200).json({ messages: olderMessages.reverse() });
        } catch (error) {
            console.error("Error in fetchOlderMessages:", error);
            return res.status(500).json({ message: "Failed to fetch older messages" });
        }
    };


    // static readConversation = async (userId, conversationId) => {

    //     //1. Check conversation, user
    //     const user = await User.findById(userId)
    //     if (!user) throw new AuthFailureError("Bạn cần đăng nhập để thực hiện thao tác này")

    //     const conversation = await Conversation.findById(conversationId)
    //         .populate("members.user", "fullName avatar")
    //         .populate("messages.senderId", "fullName avatar")

    //     if (!conversation) throw new NotFoundError("Không tìm thấy đoạn hội thoại")

    //     // Sort and limit the messages to the latest 12
    //     const sortedMessages = conversation.messages
    //         .sort((a, b) => b.createdAt - a.createdAt)
    //         .slice(0, 12)
    //         .reverse() // Reverse to maintain ascending order

    //     let formattedConversation
    //     const otherMember = conversation.members.find(
    //         (member) => member.user._id.toString() !== userId
    //     )

    //     formattedConversation = {
    //         _id: conversation._id,
    //         messages: sortedMessages,
    //         otherMember: otherMember.user,
    //     }

    //     return {
    //         conversation: formattedConversation,
    //     }
    // }

    static sendMessage = async (userId, conversationId, req) => {
        try {
            // 1. Check if conversationId is provided
            let conversation
            if (conversationId) {
                // If conversationId is provided, find the existing conversation
                conversation = await Conversation.findById(conversationId)
                if (!conversation)
                    throw new NotFoundError("Không tìm thấy đoạn hội thoại")
            } else {
                // If conversationId is not provided, create a new conversation
                const otherUserId = req.body.otherMemberId
                const otherUser = await User.findById(otherUserId)
                if (!otherUser) {
                    throw new NotFoundError("Có lỗi xảy ra")
                }

                // Create a new conversation
                conversation = new Conversation({
                    members: [{ user: userId }, { user: otherUserId }],
                    messages: [],
                })
                await conversation.save()
            }

            // 2. Validate body (content or media)
            const { content } = req.body
            if (
                !content &&
                (!req.files.media || req.files.media.length === 0)
            ) {
                throw new BadRequestError("Hãy gửi tin nhắn hoặc ảnh")
            }

            // 3. Upload media if exists
            let media = []
            if (req.files && req.files.media) {
                const uploadPromises = req.files.media.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/conversations/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                media = uploadResults.map((result) => result.secure_url)
            }

            // 4. Send message
            const otherMemberId = conversation.members.find(
                (member) => member.user.toString() !== userId
            )
            const otherMember = await User.findById(otherMemberId.user)

            conversation.messages.push({
                senderId: userId,
                content: req.body.content,
                createdAt: new Date(),
                media,
            })
            await conversation.save()

            //5. Update seenBy array
            // conversation.seenBy.concat({ userId })

            // 5. Format conversation
            const formattedConversation = {
                _id: conversation._id,
                messages: conversation.messages,
                otherMember: {
                    _id: otherMember._id,
                    fullName: otherMember.fullName,
                    avatar: otherMember.avatar,
                },
            }

            return {
                conversation: formattedConversation,
            }
        } catch (error) {
            console.log("Error sending message:", error)
            throw new Error("Failed to send message")
        }
    }
}

export default ConversationService
