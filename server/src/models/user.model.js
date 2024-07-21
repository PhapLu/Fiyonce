import mongoose from "mongoose";
const Schema = mongoose.Schema;
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const UserSchema = new Schema(
    {
        //user_id: {type: Number, required: true},
        //user_salf:{ type: String, default: ''},
        stageName: { type: String, default: "" },
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["member", "talent", "admin"],
            default: "member",
        },
        jobTitle: { type: String, trim: true },
        avatar: {
            type: String,
            default: "/uploads/pastal_system_default_avatar.png",
        },
        bg: {
            type: String,
            default: "/uploads/pastal_system_default_background.png",
        },
        address: { type: String, default: "" },
        country: { type: String, default: "Vietnam" },
        bio: {
            type: String,
            maxlength: [200, "Bio cannot exceed 200 characters"],
        },
        gender: { type: String, enum: ["male", "female", "other"] },
        dob: { type: Date, default: null },
        socialLinks: [{ type: String, required: true }],
        views: { type: Number, default: 0 },
        postBookmark: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        jobTitle: { type: String, default: "" },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "active", "block"],
        },
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: Schema.Types.ObjectId, ref: "User" }],
        // rating: {
        //   type: Number,
        //   default: 5,
        //   min: [0, "Rating cannot be negative"],
        //   max: [5, "Rating cannot exceed 5"]
        // },
        accessToken: { type: String },
        qrCode: { type: String }, //Base 64
        lastViewConversations: { type: Date, default: Date.now },
        lastViewNotifications: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
// Middleware to set the verificationExpiry field to 30 minutes in the future
UserSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("verificationExpiry")) {
        this.verificationExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
    next();
});

// Indexing for searching
UserSchema.index({ fullName: 'text', stageName: 'text', email: 'text', bio: 'text' })

const User = mongoose.model(DOCUMENT_NAME, UserSchema);
// Define a discriminator for the "talent" role
const TalentUser = User.discriminator(
    "talent",
    new Schema({
        // Add role-specific fields here

        creativeFields: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
        ],
        badges: {
            type: String,
            enum: ["trusted", "topContributor", "emerging"],
        },
    })
);

// Define a discriminator for the "member" role (no specific fields needed)
const MemberUser = User.discriminator("member", new Schema({}));

// Define a discriminator for the "admin" role (no specific fields needed)
const AdminUser = User.discriminator("admin", new Schema({}));

export { User, TalentUser, MemberUser, AdminUser };
// export default User
