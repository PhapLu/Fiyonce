import mongoose from "mongoose";

const DOCUMENT_NAME = "HelpTopic";
const COLLECTION_NAME = "HelpTopics";

const HelpTopicSchema = new mongoose.Schema(
    {
        theme: { type: String, enum:['for_artist', 'for_client', 'about'], required: true },
        title: { type: String, required: true },
    },{
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
const HelpTopic = mongoose.model(DOCUMENT_NAME, HelpTopicSchema);
export default HelpTopic;
