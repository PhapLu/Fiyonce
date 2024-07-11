import mongoose from 'mongoose'

const DOCUMENT_NAME = 'CommissionReport'
const COLLECTION_NAME = 'CommissionReports'

const CommissionReportSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    orderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    proposalId: {type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true},
    content: {type: String, required: true},
    evidences: [{type: String, required: true}],
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

const CommissionReport = mongoose.model(DOCUMENT_NAME, CommissionReportSchema)

export default CommissionReport