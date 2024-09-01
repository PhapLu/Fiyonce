import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DOCUMENT_NAME = "TalentRequest";
const COLLECTION_NAME = "TalentRequests";

const TalentRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        stageName: {
            type: String,
            required: true,
        },
        portfolioLink: {
            type: String,
            required: true,
        },
        artworks: [
            {
                type: String,
                required: true,
            },
        ],
        jobTitle: {
            type: String,
        },
        status: {
            type: String,
            default: "pending", // 'pending', 'approved', 'rejected'
            enum: ["pending", "approved", "rejected"],
        },
        taxCode: {
            type: String,
        },
        cccd: {
            type: String,
        },
        referralCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReferralCode",
        },
        rejectMessage: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const TalentRequest = mongoose.model(DOCUMENT_NAME, TalentRequestSchema);

export default TalentRequest;
