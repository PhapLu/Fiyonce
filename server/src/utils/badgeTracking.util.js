import brevoSendEmail from "../configs/brevo.email.config.js"
import { BadRequestError, NotFoundError } from "../core/error.response.js"
import Badge from "../models/badge.model.js"
import { User } from "../models/user.model.js"

//Track each badge progress

// async function updateUserProgress(userId, action, increment = 1) {
//     try {
//         // Find the user and populate badge progress
//         let user = await User.findById(userId).populate('badgeProgress.badgeId')
//         if (!user) {
//             throw new NotFoundError('User not found')
//         }

//         // Get all badges
//         const badges = await Badge.find()

//         // Process each badge
//         for (const badge of badges) {
//             let progressEntry = user.badgeProgress.find(entry => entry.badgeId._id.toString() === badge._id.toString())
//             if (!progressEntry) {
//                 console.log('No progress entry found for badge')
//                 progressEntry = { badgeId: badge._id, progress: {}, completed: false }
//                 user.badgeProgress.push(progressEntry)
//             }

//             if (progressEntry.completed) continue

//             // Update progress
//             if (!progressEntry.progress[action]) {
//                 console.log('No progress found for action')
//                 progressEntry.progress[action] = 0
//             }
//             progressEntry.progress[action] += increment

//             // Convert the progress object back to Map
//             progressEntry.progress = new Map(Object.entries(progressEntry.progress))

//             // Check if criteria are met
//             if (badge.criteria && typeof badge.criteria.entries === 'function') {
//                 const criteriaMet = Array.from(badge.criteria.entries()).every(
//                     ([criterion, value]) => (progressEntry.progress.get(criterion) || 0) >= value
//                 )

//                 // Mark as completed if criteria are met
//                 if (criteriaMet) {
//                     progressEntry.completed = true
//                     if(user.badges.length === 0){
//                         user.badges = [{ badgeId: badge._id, count: 1 }]
//                     }else{
//                         let badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
//                         if (badgeIndex !== -1) {
//                             user.badges[badgeIndex].count++
//                         } else {
//                             user.badges.push({ badgeId: badge._id, count: 1 })
//                         }
//                     }
//                 }
//             } else {
//                 console.warn(`Badge ${badge._id} has invalid criteria`)
//             }

//             // Convert progress back to an object before saving
//             progressEntry.progress = Object.fromEntries(progressEntry.progress)
//         }

//         // Save user progress
//         await user.save()

//         // Refetch the user to get the updated data
//         user = await User.findById(userId).select('-badgeProgress.badgeId')

//         return user
//     } catch (error) {
//         console.error(`Error updating user progress: ${error.message}`)
//         throw new BadRequestError(error.message)
//     }
// }

async function trackActivity(userId, activityType, increment = 1) {
    // const result = await updateUserProgress(userId, activityType, increment)
    // return result
    return 0
}

async function trackBadgeProgress(userId, badgeId, criterionKey, increment = 1) {
    try {
        // Fetch the user and badge
        const user = await User.findById(userId)
        const badge = await Badge.findById(badgeId)

        // Convert badge.criteria to an object
        const badgeCriteria = JSON.parse(badge.criteria)

        // Find the badge in the user's badges array
        let userBadge = user.badges.find(badge => badge.badgeId.toString() === badgeId.toString())
        
        // If the badge doesn't exist, add it with default values
        if (!userBadge) {
            userBadge = {
                badgeId: badge._id,
                count: 0,
                progress: new Map(),
                isComplete: false,
                awardedAt: null
            }

            // Initialize progress based on badge criteria
            for (const [criterion, totalCriteria] of Object.entries(badgeCriteria)) {
                userBadge.progress.set(criterion, {
                    currentProgress: 0,
                    totalCriteria: parseInt(totalCriteria, 10),
                    isComplete: false
                })
            }

            user.badges.push(userBadge)
        }

        // Initialize progress for the criterion if it doesn't exist
        if (!userBadge.progress.has(criterionKey)) {
            userBadge.progress.set(criterionKey, {
                currentProgress: 0,
                totalCriteria: badgeCriteria[criterionKey] || 0,
                isComplete: false
            })
        }

        const criterion = userBadge.progress.get(criterionKey)

        // Increment progress
        criterion.currentProgress += increment

        // Check if the criterion is complete
        if (criterion.currentProgress >= criterion.totalCriteria) {
            criterion.isComplete = true
            criterion.currentProgress = criterion.totalCriteria // Cap progress at totalCriteria
        }

        // Check if all criteria are complete
        const allCriteriaComplete = Array.from(userBadge.progress.values()).every(c => c.isComplete)
        if (allCriteriaComplete) {
            userBadge.isComplete = true
            userBadge.awardedAt = new Date()
            userBadge.count += 1 // Increment count to reflect that the badge is awarded
            //Send email to user
            try {
                const subject = "Badge Awarded";
                const subjectMessage = `Congratulations! You have been awarded the ${badge.title} badge!`;
                const verificationCode = '';
                const message = '';
                const template = "announcementTemplate";
                await brevoSendEmail(
                    user.email,
                    subject,
                    subjectMessage,
                    verificationCode,
                    message,
                    template
                );
            } catch (error) {
                console.error(error);
                throw new BadRequestError("Gửi email không thành công");
            }
        }

        // Assign updated progress to userBadge
        user.badges = user.badges.map(badge =>
            badge.badgeId.toString() === badgeId.toString() ? { ...badge, progress: userBadge.progress, isComplete: userBadge.isComplete, awardedAt: userBadge.awardedAt } : badge
        )

        await user.save()

        return userBadge
    } catch (error) {
        console.error("Error tracking badge progress:", error)
        throw error
    }
}

async function trackTrustedArtistBadge(userId, activityType, increment = 1) {
    try {
        // Define the badge ID for "Trusted Artist" badge
        const user = await User.findById(userId)
        const badge = await Badge.findOne({ title: "trustedArtist" })
        if(!user) throw new NotFoundError("User not found!")
        if(!badge) throw new NotFoundError("Badge not found!")

        const updatedBadge = await trackBadgeProgress(userId, badge._id.toString(), activityType, increment)

        return updatedBadge
    } catch (error) {
        console.error("Error tracking Trusted Artist badge:", error)
        throw error
    }
}

async function trackPlatformAmbassadorBadge(userId, activityType, increment = 1) {
    try {
        // Define the badge ID for "Platform Ambassador" badge
        const user = await User.findById(userId);
        const badge = await Badge.findOne({ title: 'platformAmbassador' });
        
        console.log('Badge:', badge);

        if (!user) throw new NotFoundError("User not found!");
        if (!badge) throw new NotFoundError("Badge not found!");

        const updatedBadge = await trackBadgeProgress(userId, badge._id.toString(), activityType, increment);

        return updatedBadge;
    } catch (error) {
        console.error("Error tracking Platform Ambassador badge:", error);
        throw new BadRequestError(error.message);
    }
}

export { trackActivity, trackTrustedArtistBadge, trackPlatformAmbassadorBadge }
