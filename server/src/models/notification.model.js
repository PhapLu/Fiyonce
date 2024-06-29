import mongoose from "mongoose"
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

const NotificationSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: { type: String, required: true},
    senderAvatar: { type: String, required: true},
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const Notification = mongoose.model(DOCUMENT_NAME, NotificationSchema)
export default Notification