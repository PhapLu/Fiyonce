import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'Artwork'
const COLLECTION_NAME = 'Artworks'

const ArtworkSchema = new Schema({
    talentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artworkCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtworkCategory', required: true },
    movementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movement'},
    title:{ type: String },
    description: { type: String },
    artworks: [{ type: String, required: true }],
    views: { type: Number, default: 0 },
    likes: {
        type: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }],
        default: []
    },  
    bookmarks: {
        type: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }],
        default: []
    },
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
// const ShowcasingSchema = new Schema({
//     talentId:{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// },{
//     timestamps: true,
//     collection: 'Showcasings'
// })

// const artwork = mongoose.model(DOCUMENT_NAME, ArtworkSchema);
// //const forSelling = mongoose.model('ForSelling', ForSellingSchema)
// const showcasing = mongoose.model('Showcasing', ShowcasingSchema)
// export {artwork, showcasing};

const Artwork = mongoose.model(DOCUMENT_NAME, ArtworkSchema)
export default Artwork
