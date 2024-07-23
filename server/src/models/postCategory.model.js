import mongoose from "mongoose";
const DOCUMENT_NAME = "PostCategory";
const COLLECTION_NAME = "PostCategories";

const PostCategorySchema = new mongoose.Schema(
    {
        talentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
const PostCategory = mongoose.model(DOCUMENT_NAME, PostCategorySchema);
export default PostCategory;
