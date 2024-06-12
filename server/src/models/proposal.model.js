import mongoose from 'mongoose'

const DOCUMENT_NAME = 'Proposal'
const COLLECTION_NAME = 'Proposals'

const ProposalSchema = new mongoose.Schema({
    commissionRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommissionRequest',
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
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

const Proposal = mongoose.model(DOCUMENT_NAME, ProposalSchema)

export default Proposal