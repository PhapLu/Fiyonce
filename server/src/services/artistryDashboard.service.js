import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import Badge from "../models/badge.model.js"
import Challenge from "../models/challenge.model.js"
import Submission from "../models/submission.model.js"

const countUsersAndBadges = async (levelBadges) => {
    // Count the total number of badges in the array
    const badgeCount = levelBadges.length
    // Count the total number of users who have achieved any badge in the array
    const totalUsersAchieved = await Promise.all(
        levelBadges.map(badge => User.countDocuments({ badges: badge.title }))
    )
    // Sum up the users who achieved each badge
    const totalUsers = totalUsersAchieved.reduce((acc, count) => acc + count, 0)

    return {
        badgeCount,
        totalUsers
    }
}

class ArtistryDashboardService {
    static readBadgeOverview = async (userId) => {
        // 1. Check if the user is an admin
        const admin = await User.findById(userId)
        if (!admin) throw new NotFoundError("User not found")
        if (admin.role !== "admin") throw new AuthFailureError("User is not admin")
    
        // 2. Get all badges
        const badges = await Badge.find()
    
        // 3. Count users for each badge
        const badgeData = await Promise.all(badges.map(async (badge) => {
            const usersAchieved = await User.countDocuments({ badges: badge.title })
            return {
                title: badge.title,
                displayTitle: badge.displayTitle,
                description: badge.description,
                icon: badge.icon,
                level: badge.level,
                usersAchieved
            }
        }))
    
        return {
            badges: badgeData
        }
    }

    static readBadgeAchievedOverview = async (userId) => {
        // 1. Check if the user is an admin
        const admin = await User.findById(userId)
        if (!admin) throw new NotFoundError("User not found")
        if (admin.role !== "admin") throw new AuthFailureError("User is not admin")
    
        // 2. Get all badges in each level and count users for each level
        const badges = await Badge.find()
        const easyBadges = badges.filter(badge => badge.level === "easy")
        const mediumBadges = badges.filter(badge => badge.level === "medium")
        const hardBadges = badges.filter(badge => badge.level === "hard")
    
        // 3. Count users for each level of badges
        const badgeData = await countUsersAndBadges(badges)
        const easyBadgeData = await countUsersAndBadges(easyBadges)
        const mediumBadgeData = await countUsersAndBadges(mediumBadges)
        const hardBadgeData = await countUsersAndBadges(hardBadges)
    
        return {
            badgeAchievedOverview: {
                badges: badgeData,
                easy: easyBadgeData,
                medium: mediumBadgeData,
                hard: hardBadgeData
            }
        }
    }    

    static readChallengeOverview = async (userId) => {
        // 1. Check if the user is an admin
        const admin = await User.findById(userId)
        if (!admin) throw new NotFoundError("User not found")
        if (admin.role !== "admin") throw new AuthFailureError("User is not admin")

        // 2. Get all challenges and participants count
        const challenges = await Challenge.find()
        const challengeData = await Promise.all(challenges.map(async (challenge) => {
            const participants = await Submission.countDocuments({ challengeId: challenge._id })
            return {
                title: challenge.title,
                description: challenge.description,
                shortDescription: challenge.shortDescription,
                thumbnail: challenge.thumbnail,
                startDate: challenge.startDate,
                endDate: challenge.endDate,
                sponsors: challenge.sponsors,
                isPrivate: challenge.isPrivate,
                participants: challenge.participants.length,
            }
        }))

        return {
            challenges: challengeData
        }
    }
}

export default ArtistryDashboardService
