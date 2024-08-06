import { BadRequestError, NotFoundError } from "../core/error.response.js";
import Badge from "../models/badge.model.js";
import { User } from "../models/user.model.js";

async function updateUserProgress(userId, action, increment = 1) {
    try {
        // Find the user and populate badge progress
        let user = await User.findById(userId).populate('badgeProgress.badgeId');
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Get all badges
        const badges = await Badge.find();

        // Process each badge
        for (const badge of badges) {
            let progressEntry = user.badgeProgress.find(entry => entry.badgeId._id.toString() === badge._id.toString());
            if (!progressEntry) {
                console.log('No progress entry found for badge');
                progressEntry = { badgeId: badge._id, progress: {}, completed: false };
                user.badgeProgress.push(progressEntry);
            }

            if (progressEntry.completed) continue;

            // Update progress
            if (!progressEntry.progress[action]) {
                console.log('No progress found for action');
                progressEntry.progress[action] = 0;
            }
            progressEntry.progress[action] += increment;

            // Convert the progress object back to Map
            progressEntry.progress = new Map(Object.entries(progressEntry.progress));

            // Check if criteria are met
            if (badge.criteria && typeof badge.criteria.entries === 'function') {
                const criteriaMet = Array.from(badge.criteria.entries()).every(
                    ([criterion, value]) => (progressEntry.progress.get(criterion) || 0) >= value
                );

                // Mark as completed if criteria are met
                if (criteriaMet) {
                    progressEntry.completed = true;
                    if(user.badges.length === 0){
                        user.badges = [{ badgeId: badge._id, count: 1 }];
                    }else{
                        let badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString());
                        if (badgeIndex !== -1) {
                            user.badges[badgeIndex].count++;
                        } else {
                            user.badges.push({ badgeId: badge._id, count: 1 });
                        }
                    }
                }
            } else {
                console.warn(`Badge ${badge._id} has invalid criteria`);
            }

            // Convert progress back to an object before saving
            progressEntry.progress = Object.fromEntries(progressEntry.progress);
        }

        // Save user progress
        await user.save();

        // Refetch the user to get the updated data
        user = await User.findById(userId).select('-badgeProgress.badgeId');

        return user;
    } catch (error) {
        console.error(`Error updating user progress: ${error.message}`);
        throw new BadRequestError(error.message);
    }
}

async function trackActivity(userId, activityType, increment = 1) {
    const result = await updateUserProgress(userId, activityType, increment);
    return result;
}

export { trackActivity };
