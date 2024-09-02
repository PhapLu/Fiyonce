import mongoose from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const OrderSchema = new mongoose.Schema(
    {
        commissionServiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommissionService",
        },
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        talentChosenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: [
                "waitlist",
                "pending",
                "approved",
                "rejected",
                "confirmed",
                "in_progress",
                "finished",
                "under_processing",
                "delivered"
            ],
            default: "pending",
        },
        description: {
            type: String,
            default: "",
        },
        isDirect: { type: Boolean, required: true },
        references: [
            {
                type: String,
                default: [],
            },
        ],
        isTalentArchived: { type: Boolean, default: false },
        isMemberArchived: { type: Boolean, default: false },
        rejectMessage: { type: String },
        cancelMessage: { type: String },
        minPrice: { type: Number },
        maxPrice: { type: Number },
        purpose: { type: String, enum: ["personal", "commercial"] },
        isPrivate: { type: Boolean },
        deadline: { type: Date },
        fileFormats: { type: [String], default: [] },
        momoOrderId: { type: String },
        deliverables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
        startWipAt: { type: Date },
        finalDelivery: {
            note: { type: String, default: "" },
            url: { type: String, default: "" },
            files: [{ type: String, default: [] }],
            finishedAt: { type: Date }
        }
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
const Order = mongoose.model(DOCUMENT_NAME, OrderSchema);

export default Order;
