import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Service';
const COLLECTION_NAME = 'Services';

const ServiceSchema = new mongoose.Schema({
    talentId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: { type: String, required: true },
    serviceCategoryId: {
        type: mongoose.Types.ObjectId, 
        ref:'ServiceCategory', 
        required: true
    },
    fromPrice: { type: Number, required: true },
    deliverables: [{type: String, required: true}],
    addOns:[{
        title: { type: String, required: true }, 
        value: { type: Number, required: true},
        isPercentage: { type: Boolean, default: false}
    }],
    notes: [{ type: String }],
    isMedia: { type: Boolean, default: false },
    artworks:[{ type: mongoose.Types.ObjectId, ref: 'Artwork' }],
    reviews:[
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
        }
    ],
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const Service = mongoose.model(DOCUMENT_NAME, ServiceSchema);

export default Service;
