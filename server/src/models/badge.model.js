import mongoose from "mongoose"

const DOCUMENT_NAME = "Badge"
const COLLECTION_NAME = "Badges"

const badgeSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true },
    displayTitle: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    level: { type: String, enum: ["easy", "medium", "hard"], required: true },
    type: {
        type: String,
        enum: ["platform_contributor", "challenge_participation", "sale_achievement", "other"],
        default: "other",
        required: true,
    },
    criteria: { type: String, default: "" },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const Badge = mongoose.model(DOCUMENT_NAME, badgeSchema)
export default Badge
