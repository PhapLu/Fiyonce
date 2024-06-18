import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'Artwork'
const COLLECTION_NAME = 'Artworks'

const ArtworkSchema = new Schema(
  {
    artwork_title:{ type: String },
    artwork_images: [{ type: String, required: true }],
    artwork_thumb: { type: String, required: true },
    artwork_description: { type: String },
    artwork_likes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }
    ],
    artwork_views: { type: Number, default: 0 },
    artwork_saves: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }
    ],
    artwork_fields: [{type: mongoose.Schema.Types.ObjectId, ref: 'Field'}],
    artwork_comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
    }],
    /////////
    artwork_type:{
        type: String,
        enum: ['ForSelling', 'Showcasing'],
        required: true
    },
    artwork_attributes:{
        type: Schema.Types.Mixed,
        required: true,
    },
    artwork_talent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // artwork_isDraft: {
    //     type: Boolean,
    //     index: true,
    //     default: true,
    //     select: false
    // },
    // artwork_isPublished: {
    //     type: Boolean,
    //     index: true,
    //     default: false,
    //     select: false
    // },
  },{
    timestamps: true,
    collection: COLLECTION_NAME
});

// Indexing for searching
ArtworkSchema.index({ description: 'text' });

// const ForSellingSchema = new Schema({
//     artwork_price: {
//         type: Number,
//         required: true
//     },
//     artwork_quantity:{
//         type: Number,
//         required: true
//     },
//     artwork_talent:{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// },{
//     timestamps: true,
//     collection: 'ForSellings'
// })

const ShowcasingSchema = new Schema({
    artwork_talent:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true,
    collection: 'Showcasings'
})

const artwork = mongoose.model(DOCUMENT_NAME, ArtworkSchema);
//const forSelling = mongoose.model('ForSelling', ForSellingSchema)
const showcasing = mongoose.model('Showcasing', ShowcasingSchema)
export {artwork, showcasing};

