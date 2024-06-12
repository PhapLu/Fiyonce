import mongoose, { mongo } from "mongoose";
const DOCUMENT_NAME = 'CommissionRequest'
const COLLECTION_NAME = 'CommissionRequests'

const CommissionRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    talentAppliedIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    talentChosenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // character: {
    //     photo: { type: String },
    //     name: { type: String },
    //     description: { type: String }
    // },
    isDirect: {type: Boolean, required: true},
    references: [{ 
        content: { type: String }, 
        isMedia: { type: Boolean } 
    }],
    minPrice: { type: Number },
    maxPrice: { type: Number },
    purposes: [{ type: String, enum: ['personal', 'commercial'] }],
    isPrivate: { type: Boolean },
    deadline: { type: Date},
    fileFormats: [{ type: String }],
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const CommissionRequest = mongoose.model(DOCUMENT_NAME, CommissionRequestSchema)

export default CommissionRequest