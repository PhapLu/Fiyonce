import mongoose from "mongoose";

const DOCUMENT_NAME = "HelpArticle";
const COLLECTION_NAME = "HelpArticles";

const HelpArticleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        helpTopicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HelpTopic",
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
const HelpArticle = mongoose.model(DOCUMENT_NAME, HelpArticleSchema);
export default HelpArticle;
