import mongoose from "mongoose"

const DOCUMENT_NAME = "Challenge"
const COLLECTION_NAME = "Challenges"

const ChallengeSchema = new mongoose.Schema(
    {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        thumbnail: { type: String},
        startDate: { type: Date},
        endDate: { type: Date},
        prizes: { type: String, default: '' },
        rules: { type: String, default: '' },
        isPrivate: { type: Boolean, default: false },
        status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
        sponsors: [{
            title: { type: String, default: '' },
            logo: { type: String, default: '' },
            level: { type: String, enum:['diamond', 'gold', 'silver', 'bronze']},
        }],
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const Challenge = mongoose.model(DOCUMENT_NAME, ChallengeSchema)
export default Challenge
