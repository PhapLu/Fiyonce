import mongoose from 'mongoose'

const DOCUMENT_NAME = 'Proposal'
const COLLECTION_NAME = 'Proposals'

const ProposalSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    talentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    scope: {
        type: String,
        required: true
    },
    deadLine: {
        type: Date,
    },
    artworks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
    }],
    price: {
        type: Number,
        required: true
    },
    rejectMessage: { 
        type: String
    },
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

const Proposal = mongoose.model(DOCUMENT_NAME, ProposalSchema)

export default Proposal