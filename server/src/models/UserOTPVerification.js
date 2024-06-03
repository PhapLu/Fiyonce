import mongoose from "mongoose";
import { Schema } from "mongoose";

const DOCUMENT_NAME = 'UserOTPVerification';
const COLLECTION_NAME = 'UserOTPVerifications';

const UserOTPVerificationSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true,
        index: { expires: 1800 } // Expire after 1800 seconds (30 minutes)
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

UserOTPVerificationSchema.pre('save', function(next) {
    // Set expiredAt to 30 minutes (1800 seconds) in the future
    this.expiredAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    next();
});

const UserOTPVerification = mongoose.model(DOCUMENT_NAME, UserOTPVerificationSchema);

export default UserOTPVerification;
