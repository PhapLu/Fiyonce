import Conversation from "../models/conversation.model.js";
import { User } from "../models/user.model.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";
import {
    compressAndUploadImage,
    deleteFileByPublicId,
    extractPublicIdFromUrl,
} from "../utils/cloud.util.js";

class ConversationService {
    static createConversation = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId);
        if (!user) throw new AuthFailureError("User not found");

        //2. Validate request body
        const { otherMemberId, content } = req.body;
        if (!otherMemberId)
            throw new BadRequestError("Please provide all required fields");
        if (!content && (!req.files.media || req.file.media.length == 0))
            throw new BadRequestError("Please provide content or media");

        //3. Upload media
        try {
            let media = [];

            if (req.files && req.files.media) {
                const uploadPromises = req.files.media.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/conversations/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                );
                const uploadResults = await Promise.all(uploadPromises);
                media = uploadResults.map((result) => result.secure_url);
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
            });
            await conversation.save();

            return {
                conversation,
            };
        } catch (error) {
            console.log("Error uploading images:", error);
            throw new Error("File upload or database save failed");
        }
    };

    static readConversations = async (userId) => {
        //1. Check user
        const user = await User.findById(userId);
        if (!user) throw new AuthFailureError("User not found");

        //2. Read conversations
        const conversations = await Conversation.find({
            "members.user": userId,
        }).populate("members.user", "fullName avatar");
        const formattedConversations = conversations.map((conversation) => {
            let lastMessage =
                conversation.messages[conversation.messages.length - 1];
            let otherMember = conversation.members.find(
                (member) => member.user._id.toString() !== userId
            );

            return {
                ...conversation._doc, // Include all other conversation properties
                otherMember: otherMember.user,
                lastMessage: lastMessage,
            };
        });

        return {
            conversations: formattedConversations,
        };
    };

    static readConversationWithOtherMember = async (userId, otherMemberId) => {
        // 1. Check user and other member
        const user = await User.findById(userId);
        const otherMember = await User.findById(otherMemberId);
        if (!user) throw new AuthFailureError("User not found");
        if (!otherMember) throw new BadRequestError("Other member not found");

        // 2. Read conversation
        const conversation = await Conversation.findOne({
            "members.user": {
                $all: [userId, otherMemberId],
            },
        }).populate("members.user", "fullName avatar");

        if (!conversation) throw new NotFoundError("Conversation not found");

        // 3. Check if userId is already in the seenBy array
        const userSeen = conversation.seenBy.some(
            (seen) => seen.userId.toString() === userId
        );

        if (!userSeen) {
            // Add userId to the seenBy array
            conversation.seenBy.push({ userId });
            await conversation.save();
        }

        // 4. Format conversation

        // Sort and limit the messages to the latest 12
        const sortedMessages = conversation.messages
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 12)
            .reverse(); // Reverse to maintain ascending order

        const formattedConversation = {
            _id: conversation._id,
            messages: sortedMessages,
            otherMember: {
                _id: otherMember._id,
                fullName: otherMember.fullName,
                avatar: otherMember.avatar,
            },
        };

        return {
            conversation: formattedConversation,
        };
    };

    static readConversation = async (userId, conversationId) => {
        //1. Check conversation, user
        const user = await User.findById(userId);
        if (!user) throw new AuthFailureError("User not found");

        const conversation = await Conversation.findById(conversationId)
            .populate("members.user", "fullName avatar")
            .populate("messages.senderId", "fullName avatar");

        if (!conversation) throw new NotFoundError("Conversation not found");

        // Sort and limit the messages to the latest 12
        const sortedMessages = conversation.messages
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 12)
            .reverse(); // Reverse to maintain ascending order

        let formattedConversation;
        const otherMember = conversation.members.find(
            (member) => member.user._id.toString() !== userId
        );

        formattedConversation = {
            _id: conversation._id,
            messages: sortedMessages,
            otherMember: otherMember.user,
        };

        return {
            conversation: formattedConversation,
        };
    };

    static sendMessage = async (userId, conversationId, req) => {
        try {
            // 1. Check if conversationId is provided
            let conversation;
            if (conversationId) {
                // If conversationId is provided, find the existing conversation
                conversation = await Conversation.findById(conversationId);
                if (!conversation)
                    throw new NotFoundError("Conversation not found");
            } else {
                // If conversationId is not provided, create a new conversation
                const otherUserId = req.body.otherMemberId;
                const otherUser = await User.findById(otherUserId);
                if (!otherUser) {
                    throw new NotFoundError("Other user not found");
                }

                // Create a new conversation
                conversation = new Conversation({
                    members: [{ user: userId }, { user: otherUserId }],
                    messages: [],
                });
                await conversation.save();
            }

            // 2. Validate body (content or media)
            const { content } = req.body;
            if (
                !content &&
                (!req.files.media || req.files.media.length === 0)
            ) {
                throw new BadRequestError("Please provide content or media");
            }

            // 3. Upload media if exists
            let media = [];
            if (req.files && req.files.media) {
                const uploadPromises = req.files.media.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/conversations/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                );
                const uploadResults = await Promise.all(uploadPromises);
                media = uploadResults.map((result) => result.secure_url);
            }

            // 4. Send message
            const otherMemberId = conversation.members.find(
                (member) => member.user.toString() !== userId
            );
            const otherMember = await User.findById(otherMemberId.user);

            conversation.messages.push({
                senderId: userId,
                content: req.body.content,
                createdAt: new Date(),
                media,
            });
            await conversation.save();

            // 5. Format conversation
            const formattedConversation = {
                _id: conversation._id,
                messages: conversation.messages,
                otherMember: {
                    _id: otherMember._id,
                    fullName: otherMember.fullName,
                    avatar: otherMember.avatar,
                },
            };

            return {
                conversation: formattedConversation,
            };
        } catch (error) {
            console.log("Error sending message:", error);
            throw new Error("Failed to send message");
        }
    };
}

export default ConversationService;
