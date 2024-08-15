import mongoose from "mongoose";

const DOCUMENT_NAME = "AccountReport";
const COLLECTION_NAME = "AccountReports";

const AccountReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userIdReported: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: { type: String, required: true },
        evidences: [{ type: String, required: true }],
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const AccountReport = mongoose.model(DOCUMENT_NAME, AccountReportSchema);

export default AccountReport;
