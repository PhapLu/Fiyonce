import mongoose from "mongoose";

const DOCUMENT_NAME = "HelpTheme";
const COLLECTION_NAME = "HelpThemes";

const HelpThemeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
const HelpTheme = mongoose.model(DOCUMENT_NAME, HelpThemeSchema);
export default HelpTheme;
