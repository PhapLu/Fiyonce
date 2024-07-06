import mongoose from "mongoose"

const DOCUMENT_NAME = 'HelpTopic'
const COLLECTION_NAME = 'HelpTopics'

const HelpTopicSchema = new mongoose.Schema({
    title: {type: String, required: true},
    helpThemeId: {type: mongoose.Schema.Types.ObjectId, ref: 'HelpTheme', required: true},
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
const HelpTopic = mongoose.model(DOCUMENT_NAME, HelpTopicSchema)
export default HelpTopic