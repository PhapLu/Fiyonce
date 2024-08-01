import mongoose from "mongoose"
const DOCUMENT_NAME = "Submission"
const COLLECTION_NAME = "Submissions"

const SubmissionSchema = new mongoose.Schema(
    {
        challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        artwork: { type: String, ref: 'Artwork', required: true },
        description: { type: String, default: '' },
        votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        status: { type: String, enum: ['submitted', 'approved', 'rejected'], default: 'submitted' }
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const Submission = mongoose.model(DOCUMENT_NAME, SubmissionSchema)
export default Submission
