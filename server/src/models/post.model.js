import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";

const PostSchema = new Schema({
    talentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'PostCategory' },
    movementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movement'},
    description: { type: String },
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true }],
    likes: {
        type: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }],
        default: []
    },
    views: {
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
})

// Indexing for searching
PostSchema.index({ description: "text" });

const Post = mongoose.model(DOCUMENT_NAME, PostSchema);
export default Post;
