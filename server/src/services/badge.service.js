import Badge from "../models/badge.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import {
    compressAndUploadImage,
    deleteFileByPublicId,
    extractPublicIdFromUrl,
} from "../utils/cloud.util.js"
import { checkAmbassadorAchievable, checkEarlyBirdAchievable, checkTrustedArtistAchievable } from "../models/repositories/badge.repo.js"

class BadgeService {
    static readBadge = async (userId, badgeKey) => {
        // 1. Check user
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("User not found!");
    
        // 2. Check if badge is achievable
        let achievable = false;
        switch(badgeKey) {
            case "earlyBird":
                achievable = await checkEarlyBirdAchievable(user);
                break;
            case "trustedArtist":
                achievable = await checkTrustedArtistAchievable(user);
                break;
            case "platformAmbassador":
                achievable = await checkAmbassadorAchievable(user);
                break;
            default:
                throw new BadRequestError("Invalid badge key!");
        }
        
        // 3. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(badge => badge === badgeKey);
        const claimable = achievable && badgeIndex === -1;

        return {
            claimable
        };
    }      

    static awardBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("User not found!")

        //2. Check if user is achievable
        let achievable = false;
        switch(badgeKey) {
            case "earlyBird":
                achievable = await checkEarlyBirdAchievable(user);
                break;
            case "trustedArtist":
                achievable = await checkTrustedArtistAchievable(user);
                break;
            case "platformAmbassador":
                achievable = await checkAmbassadorAchievable(user);
                break;
            default:
                throw new BadRequestError("Something went wrong!")
        }
        if(!achievable) throw new BadRequestError("User is not eligible for this badge!")

        //3. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(badge => badge === badgeKey)
        if(badgeIndex !== -1) throw new BadRequestError("User already has this badge!")

        //4. Award the badge
        user.badges.push(badgeKey)
        await user.save()

        return {
            message: "Badge awarded successfully!"
        }
    }
}

export default BadgeService
