import mongoose from 'mongoose'

const DOCUMENT_NAME = 'Apply'
const COLLECTION_NAME = 'Applies'

const ApplySchema = new mongoose.Schema({
    briefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brief',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    talentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artworks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork'
    }],
    price: {
        type: Number,
        required: true
    },
    message: {
        type: String,
    },
   
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

const Apply = mongoose.model(DOCUMENT_NAME, ApplySchema)

export default Apply