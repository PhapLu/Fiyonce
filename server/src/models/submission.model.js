import mongoose from "mongoose"
const DOCUMENT_NAME = "Submission"
const COLLECTION_NAME = "Submissions"

const SubmissionSchema = new mongoose.Schema(
    {
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        artwork: { type: String, ref: 'Artwork', required: true },
        description: { type: String, default: '' },
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const Submission = mongoose.model(DOCUMENT_NAME, SubmissionSchema)
export default Submission
