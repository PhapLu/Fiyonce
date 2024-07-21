import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";

const PostSchema = new Schema(
    {
        talentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PostCategory",
        },
        movementId: { type: mongoose.Schema.Types.ObjectId, ref: "Movement" },
        description: { type: String },
        artworks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Artwork",
                required: true,
            },
        ],
        views: { type: Number, default: 0 },
        likes: {
            type: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                },
            ],
            default: [],
        },
        bookmarks: {
            type: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Indexing for searching
PostSchema.index({ description: "text" });

const Post = mongoose.model(DOCUMENT_NAME, PostSchema);
export default Post;
