import mongoose from "mongoose";
const DOCUMENT_NAME = 'Movement'
const COLLECTION_NAME = 'Movements'

const MovementSchema = new mongoose.Schema({
    
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const Movement = mongoose.model(DOCUMENT_NAME, MovementSchema)
export default Movement