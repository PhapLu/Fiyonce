import mongoose from "mongoose"
const DOCUMENT_NAME = "Badge"
const COLLECTION_NAME = "Badges"

const BadgeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        level: { type: String, enum: ["easy", "intermediate", "hard", "extremelyHard"], default: "easy"},
        count: { type: Number },
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const Badge = mongoose.model(DOCUMENT_NAME, BadgeSchema)
export default Badge
