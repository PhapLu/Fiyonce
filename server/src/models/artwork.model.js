import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'Artwork'
const COLLECTION_NAME = 'Artworks'

const ArtworkSchema = new Schema({
    talentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artworkCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtworkCategory', required: true },
    movementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movement'},
    artworkTitle:{ type: String },
    artworkImages: [{ type: String, required: true }],
    artworkDescription: { type: String },
    artworkLikes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }
    ],
    artworkViews: { type: Number, default: 0 },
    artworkBookmarks: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }
    ],
    // artworkComments: [{
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //     content: { type: String, required: true },
    //     createdAt: { type: Date, default: Date.now },
    // }],
    /////////
    // artworkType:{
    //     type: String,
    //     enum: ['ForSelling', 'Showcasing'],
    //     required: true
    // },
    // artworkAttributes:{
    //     type: Schema.Types.Mixed,
    //     required: true,
    // },
    // artworkIsDraft: {
    //     type: Boolean,
    //     index: true,
    //     default: true,
    //     select: false
    // },
    // artworkIsPublished: {
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
//     artworkTalent:{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// },{
//     timestamps: true,
//     collection: 'ForSellings'
// })

const ShowcasingSchema = new Schema({
    talentId:{
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

