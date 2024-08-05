import mongoose from "mongoose";

const DOCUMENT_NAME = "ReferralCode";
const COLLECTION_NAME = "ReferralCodes";

const referralCodeSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        referrer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        referred: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

const ReferralCode = mongoose.model(DOCUMENT_NAME, referralCodeSchema);
export default ReferralCode;
