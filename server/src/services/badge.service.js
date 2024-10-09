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
    static readEarlyBirdBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found!")

        //2. Check if badge is already awarded (if it awarded -> claimable = false, if not -> claimable = true)
        const badgeIndex = user.badges.findIndex(badge => badge === badgeKey)
        let claimable = false
        if(badgeIndex !== -1) {
            claimable = true
        }

        return {
            claimable
        }
    }

    static readTrustedArtistBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found!")

        //2. Check if badge is achieved
        const achievable = await checkTrustedArtistAchievable(user)
        
        //3. Check if badge is already awarded (if it awarded -> claimable = false, if not -> claimable = true)
        const badgeIndex = user.badges.findIndex(badge => badge === badgeKey)

        let claimable = false
        if(achievable && badgeIndex === -1) {
            claimable = true
        }

        return {
            claimable
        }
    }

    static readPlatformAmbassadorBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found!")

        //2. Check if badge is achieved
        const achievable = await checkAmbassadorAchievable(user)
        
        //3. Check if badge is already awarded (if it awarded -> claimable = false, if not -> claimable = true)
        const badgeIndex = user.badges.findIndex(badge => badge === badgeKey)
        let claimable = false
        if(achievable && badgeIndex === -1) {
            claimable = true
        }

        return {
            claimable
        }
    } 

    static awardEarlyBirdBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("User not found!")

        //2. Check if user is achievable
        const achievable = await checkEarlyBirdAchievable(user)
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

    static awardTrustedArtistBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("User not found!")

        //2. Check if user is achievable
        const achievable = await checkTrustedArtistAchievable(user)
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

    static awardPlatformAmbassadorBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("User not found!")

        //2. Check if user is achievable
        const achievable = await checkAmbassadorAchievable(user)
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
