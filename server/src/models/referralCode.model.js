// models/ReferralCode.js
import mongoose from "mongoose";

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
        timestamps: true,
    }
);

const ReferralCode = mongoose.model("ReferralCode", referralCodeSchema);
export default ReferralCode;
