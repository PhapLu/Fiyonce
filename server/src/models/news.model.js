import mongoose from "mongoose";
const DOCUMENT_NAME = "News";
const COLLECTION_NAME = "News";

const NewsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subTitle: { type: String, default: "" },
        content: { type: String, required: true },
        thumbnail: { type: String, required: true },
        views: { type: Number},
        isPinned: { type: Boolean, required: true, default: false },
        isPrivate: { type: Boolean, required: true, default: true},
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const News = mongoose.model(DOCUMENT_NAME, NewsSchema);
export default News;
