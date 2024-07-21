import mongoose from "mongoose";
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const KeyTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        privateKey: {
            type: String,
            required: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: Array,
            default: [],
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
const Key = mongoose.model(DOCUMENT_NAME, KeyTokenSchema);
export default Key;
