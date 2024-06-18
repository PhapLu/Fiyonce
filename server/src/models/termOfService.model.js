import mongoose from "mongoose";
const DOCUMENT_NAME = 'TermOfService'
const COLLECTION_NAME = 'TermOfServices'

const TermOfServiceSchema = new mongoose.Schema({
    
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const TermOfService = mongoose.model(DOCUMENT_NAME, TermOfServiceSchema)
export default TermOfService