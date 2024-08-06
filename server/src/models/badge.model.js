import mongoose from "mongoose"

const DOCUMENT_NAME = "Badge"
const COLLECTION_NAME = "Badges"

const badgeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    level: { type: String, enum: ["easy", "medium", "hard"], required: true },
    type: {
        type: String,
        enum: ["platform_contributor", "commission_count", "achievement"],
        required: true,
    },
    criteria: { type: Map, of: Number, required: true },
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

const Badge = mongoose.model(DOCUMENT_NAME, badgeSchema)
export default Badge
