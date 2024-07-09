import mongoose, { mongo } from "mongoose"
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const OrderSchema = new mongoose.Schema({
    commissionServiceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    talentChosenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'confirmed', 'canceled', 'in_progress', 'finished', 'under_processing'],
        default: 'pending'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
    },
    // character: {
    //     photo: { type: String },
    //     name: { type: String },
    //     description: { type: String }
    // },
    isDirect: {type: Boolean, required: true},
    references: [{
        type: String
    }],
    rejectMessage: { type: String, default: ''},
    minPrice: { type: Number },
    maxPrice: { type: Number },
    purpose: { type: String, enum: ['personal', 'commercial'] },
    isPrivate: { type: Boolean },
    deadline: { type: Date},
    fileFormats: { type: [String], default: [] },
    review: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number},
        comment: { type: String},
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const Order = mongoose.model(DOCUMENT_NAME, OrderSchema)

export default Order