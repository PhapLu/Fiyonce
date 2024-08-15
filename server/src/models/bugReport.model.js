import mongoose from "mongoose";

const DOCUMENT_NAME = "BugReport";
const COLLECTION_NAME = "BugReports";

const BugReportSchema = new mongoose.Schema(
    {
        userId: {
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

const BugReport = mongoose.model(DOCUMENT_NAME, BugReportSchema);

export default BugReport;
