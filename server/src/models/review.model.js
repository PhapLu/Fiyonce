import mongoose from "mongoose"

const DOCUMENT_NAME = "Review"
const COLLECTION_NAME = "Reviews"

const ReviewSchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reviewedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
        content: { type: String},
        rating: { type: Number, enum: [1,2,3,4,5], required: true },
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const Review = mongoose.model(DOCUMENT_NAME, ReviewSchema)
export default Review
