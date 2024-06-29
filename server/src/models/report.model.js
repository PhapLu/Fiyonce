import mongoose from "mongoose"
const DOCUMENT_NAME = 'Report'
const COLLECTION_NAME = 'Reports'

const ReportSchema = new mongoose.Schema({
    
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const Report = mongoose.model(DOCUMENT_NAME, ReportSchema)
export default Report