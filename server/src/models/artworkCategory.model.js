import mongoose from "mongoose"
const DOCUMENT_NAME = 'ArtworkCategory'
const COLLECTION_NAME = 'ArtworkCategories'

const ArtworkCategorySchema = new mongoose.Schema({
    talentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const ArtworkCategory = mongoose.model(DOCUMENT_NAME, ArtworkCategorySchema)
export default ArtworkCategory