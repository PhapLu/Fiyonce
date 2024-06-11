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
    briefOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    talentsAccepted:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    talentChosen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // character: {
    //     photo: { type: String },
    //     name: { type: String },
    //     description: { type: String }
    // },
    toMarket: {type: Boolean, required: true},
    referencePhotos: [{ type: String }],
    minPrice: { type: Number },
    maxPrice: { type: Number },
    isCommercialPurpose: { type: Boolean},
    isPrivate: { type: Boolean },
    deadline: { type: Date},
    fileFormats: [{ type: String }],
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const Brief = mongoose.model(DOCUMENT_NAME, BriefSchema)

export default Brief