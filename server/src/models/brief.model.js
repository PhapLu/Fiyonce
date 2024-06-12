import mongoose, { mongo } from "mongoose";
const DOCUMENT_NAME = 'Brief'
const COLLECTION_NAME = 'Briefs'

const BriefSchema = new mongoose.Schema({
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
const Brief = mongoose.model(DOCUMENT_NAME, BriefSchema)

export default Brief