import mongoose from "mongoose";

const DOCUMENT_NAME = "CommissionReport";
const COLLECTION_NAME = "CommissionReports";

const CommissionReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        proposalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proposal",
            required: true,
        },
        content: { type: String, required: true },
        evidences: [{ type: String, required: true }],
        adminDecision: {
            decision: {
                type: String,
                enum: ["client_favored", "artist_favored", "neutral"],
                required: false,
            },
            reason: { type: String, default: '' },
            notified: { type: Boolean, default: false },
        },
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const CommissionReport = mongoose.model(DOCUMENT_NAME, CommissionReportSchema);

export default CommissionReport;
