import mongoose, { Schema } from "mongoose"

const DOCUMENT_NAME = 'Artwork'
const COLLECTION_NAME = 'Artworks'

const ArtworkSchema = new Schema({
    postId:{ type: Schema.Types.ObjectId, ref: 'User'},
    url:{ type: String, required: true },
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

const Artwork = mongoose.model(DOCUMENT_NAME, ArtworkSchema)
export default Artwork
