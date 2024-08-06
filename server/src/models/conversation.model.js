import mongoose from "mongoose";

const DOCUMENT_NAME = "Conversation";
const COLLECTION_NAME = "Conversations";

const ConversationSchema = new mongoose.Schema(
    {
        members: [
            {
                user: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            },
        ],
        messages: [
            {
                senderId: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                content: { type: String },
                media: { type: [String] },
                createdAt: { type: Date, default: Date.now },
                isSeen: {
                    type: Boolean,
                    default: false,
                }
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const Conversation = mongoose.model(DOCUMENT_NAME, ConversationSchema);
export default Conversation;
