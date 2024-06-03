import mongoose from "mongoose";
const Schema = mongoose.Schema;
const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const UserSchema = new Schema(
  {
    //user_id: {type: Number, required: true},
    //user_salf:{ type: String, default: ''},
    stageName:{ type: String},
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true},
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['member', 'talent', 'admin'],
      default: 'member'
    },
    avatar: {
      type: String,
      default:
        "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png",
    },
    bg: {
      type: String,
    },
    number: { type: String },
    city: { type: String },
    country: { type: String, default: "Vietnam" },
    phone: {
      type: String,
      minlength: [10, "Phone number must have at least 10 characters"],
      maxlength: [10, "Phone number cannot exceed 10 characters"],
    },
    bio: {
        type: String,
        maxlength: [200, "Bio cannot exceed 200 characters"],
    },
    gender: {type: String, enum: ["male", "female", "other"]},
    dob: { type: Date, default: null},
    socialLinks: [
      {
        url: { type: String }, 
      },
    ],
    bookmark: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }
    ],
    status:{ type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    followers:[ { type: Schema.Types.ObjectId, ref: 'User' } ],
    following:[ { type: Schema.Types.ObjectId, ref: 'User' } ],
    accessToken: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationExpiry: { type: Date, default: Date.now, index: { expires: 1800 } } // TTL Index
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);
// Middleware to set the verificationExpiry field to 30 minutes in the future
UserSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('verificationExpiry')) {
    this.verificationExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
  next();
});
// Define a list of predefined background image URLs
// const predefinedBgImages = [
//   'url1.jpg',
//   'url2.jpg',
//   'url3.jpg',
//   'url4.jpg',
//   'url5.jpg'
// ];

// // Middleware to set a random background image URL before saving the user document
// UserSchema.pre('save', function (next) {
//   // Check if the bgImg field is not already set
//   if (!this.bg) {
//     // Set a random URL from the predefined list
//     const randomIndex = Math.floor(Math.random() * predefinedBgImages.length);
//     this.bg = predefinedBgImages[randomIndex];
//   }

//   // Continue with the save operation
//   next();
// });

// Indexing for searching
UserSchema.index({ fullname: 'text', username: 'text', bio: 'text' });

const User = mongoose.model(DOCUMENT_NAME, UserSchema);
// Define a discriminator for the "talent" role
const TalentUser = User.discriminator(
  "talent",
  new Schema({
    // Add role-specific fields here
    rating: {
        type: Number, 
        default: 5, 
        min: [0, "Rating cannot be negative"], 
        max: [5, "Rating cannot exceed 5"] 
    },
    creativeFields: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Field' }
    ],
    badges: {
      type: String,
      enum: ['trusted', 'topContributor', 'emerging']
    },
  })
);

// Define a discriminator for the "member" role (no specific fields needed)
const MemberUser = User.discriminator("member", new Schema({}));

// Define a discriminator for the "admin" role (no specific fields needed)
const AdminUser = User.discriminator("admin", new Schema({}));

export { User, TalentUser, MemberUser, AdminUser };
// export default User;