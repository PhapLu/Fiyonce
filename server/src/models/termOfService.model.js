import mongoose from "mongoose";
const DOCUMENT_NAME = 'TermOfService'
const COLLECTION_NAME = 'TermOfServices'

const TermOfServiceSchema = new mongoose.Schema({
    general: {type: String, required: true},
    payments: {type: String, required: true},
    revisions: {type: String, required: true},
    deadlinesAndDelivery: {type: String, required: true},
    use: {type: String, required: true},
    intellectualPropertyRights: {type: String, required: true},
    refunds: {type: String, required: true},
    communication: {type: String, required: true},
    updatedAt: {type: Date}
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const TermOfService = mongoose.model(DOCUMENT_NAME, TermOfServiceSchema)
export default TermOfService