import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    levels: { type: String, enum: ["easy", "medium", "hard"], required: true },
    type: {
        type: String,
        enum: ["platform_contributor", "commission_count", "achievement"],
        required: true,
    },
    criteria: { type: Map, of: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
