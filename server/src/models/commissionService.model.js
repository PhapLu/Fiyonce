import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DOCUMENT_NAME = "CommissionService";
const COLLECTION_NAME = "CommissionServices";

const ServiceSchema = new mongoose.Schema(
    {
        talentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        serviceCategoryId: {
            type: mongoose.Types.ObjectId,
            ref: "ServiceCategory",
            required: true,
        },
        views: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
        orderCount: { type: Number, default: 0 },
        termOfServiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TermOfService",
            required: true,
        },
        movementId: {
            type: Schema.Types.ObjectId,
            ref: "Movement",
            required: true,
        },
        minPrice: { type: Number, required: true },
        deliverables: [{ type: String, required: true }],
        addOns: [
            {
                title: { type: String, required: true },
                value: { type: Number, required: true },
                isPercentage: { type: Boolean, default: false },
                default: []
            },
        ],
        notes: { type: String },
        isMedia: { type: Boolean, default: false },
        status: { type: String, enum: ["open", "closed", "waitList"], default: "open" },
        artworks: [{ type: String, default:[]}],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const Service = mongoose.model(DOCUMENT_NAME, ServiceSchema);

export default Service;
