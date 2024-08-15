import mongoose from "mongoose"
const Schema = mongoose.Schema

const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "Users"

const UserSchema = new Schema(
    {
        googleId: { type: String, default: "" },
        stageName: { type: String, default: "" },
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, default: '' },
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
        phone: { type: String },
        address: { type: String, default: "" },
        country: { type: String, default: "Vietnam" },
        bio: {
            type: String,
            maxlength: [200, "Bio cannot exceed 200 characters"],
        },
        profileStatus: {
            icon: { type: String, default: "" },
            title: { type: String, default: "" },
        },
        badges: [{ 
            badgeId: { type: Schema.Types.ObjectId, ref: "Badge" },
            count: { type: Number, default: 0 },
            progress: [{ 
                criterion: { type: String, default: "" },
                progress: {type: Number, default: 0},
                isComplete: { type: Boolean, default: false }
            }],
            awardedAt: { type: Date, default: Date.now }
        }],
        // badgeProgress: [{
        //     badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
        //     progress: { type: Object, default: {} },  // Change Map to Object
        //     completed: { type: Boolean, default: false }
        // }],
        referralCode: { type: String},
        pronoun: { type: String, default: "" },
        dob: { type: Date, default: null },
        socialLinks: [{ type: String, required: true }],
        views: { type: Number, default: 0 },
        postBookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        jobTitle: { type: String, default: "" },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "active", "block"],
        },
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: Schema.Types.ObjectId, ref: "User" }],
        taxCode:{
            code: { type: String, default: "" },
            isVerified: { type: Boolean, default: false },
            message: { type: String, default: "" }
        },
        cccd: {
            type: String,
            default: ''
        },
        accessToken: { type: String },
        qrCode: { type: String }, //Base 64
        lastViewConversations: { type: Date, default: Date.now },
        lastViewNotifications: { type: Date, default: Date.now },
        timeZone: {type: String, default: ""},
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)
// Middleware to set the verificationExpiry field to 30 minutes in the future
UserSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("verificationExpiry")) {
        this.verificationExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    }
    next()
})

// Indexing for searching
UserSchema.index({ fullName: 'text', stageName: 'text', email: 'text', bio: 'text' })

const User = mongoose.model(DOCUMENT_NAME, UserSchema)
// Define a discriminator for the "talent" role
const TalentUser = User.discriminator(
    "talent",
    new Schema({
        // Add role-specific fields here
        creativeFields: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
        ],
    })
)

// Define a discriminator for the "member" role (no specific fields needed)
const MemberUser = User.discriminator("member", new Schema({}))

// Define a discriminator for the "admin" role (no specific fields needed)
const AdminUser = User.discriminator("admin", new Schema({}))

export { User, TalentUser, MemberUser, AdminUser }
// export default User
