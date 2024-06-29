import mongoose from "mongoose"
const DOCUMENT_NAME = 'ServiceCategory'
const COLLECTION_NAME = 'ServiceCategories'

const ServiceCategorySchema = new mongoose.Schema({
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
const ServiceCategory = mongoose.model(DOCUMENT_NAME, ServiceCategorySchema)
export default ServiceCategory