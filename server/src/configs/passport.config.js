import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import axios from "axios";
import { generateToken } from "../utils/token.util.js";
import { access } from "fs";
import crypto from "crypto";

// Set axios timeout
axios.defaults.timeout = 10000; // 10 seconds

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.NODE_ENV === "production"
                ? process.env.CLIENT_ORIGIN + "/v1/api/auth/google/callback"
                : "http://localhost:3000/v1/api/auth/google/callback",

        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find or create user in your database
                let user = await User.findOne({ email: profile.emails[0].value });
                
                //Create referral code
                let referral = {};
                const referralCode = crypto.randomBytes(6).toString("hex").toUpperCase();
                referral.code = referralCode;
                referral.referred = [];

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        password: "",
                        accessToken: accessToken,
                        referral: referral
                    });
                }
                const jwtToken = generateToken(user)
                user.accessToken = jwtToken
                await user.save();

                return done(null, user);
            } catch (err) {
                console.error("Error during authentication:", err);
                console.error("Detailed error:", JSON.stringify(err, null, 2));
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.error("Error during deserialization:", err);
        done(err, null);
    }
});
