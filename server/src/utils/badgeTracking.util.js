import { BadRequestError, NotFoundError } from "../core/error.response";
import Badge from "../models/badge.model";
import { User } from "../models/user.model";

async function updateUserProgress(userId, action, increment = 1) {
    try {
        // Find the user and populate badge progress
        const user = await User.findById(userId).populate('badgeProgress.badgeId');
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Get all badges
        const badges = await Badge.find();

        // Process each badge
        for (const badge of badges) {
            let progressEntry = user.badgeProgress.find(entry => entry.badgeId.toString() === badge._id.toString());
            if (!progressEntry) {
                progressEntry = { badgeId: badge._id, level: 1, progress: {}, completed: false };
                user.badgeProgress.push(progressEntry);
            }

            if (progressEntry.completed) continue;

            // Update progress
            if (!progressEntry.progress[action]) {
                progressEntry.progress[action] = 0;
            }
            progressEntry.progress[action] += increment;

            // Check if criteria for current level are met
            const currentLevel = badge.levels.find(level => level.level === progressEntry.level);
            const criteriaMet = Array.from(currentLevel.criteria.entries()).every(
                ([criterion, value]) => (progressEntry.progress[criterion] || 0) >= value
            );

            // Level up if criteria are met
            if (criteriaMet) {
                progressEntry.level += 1;
                if (progressEntry.level > badge.levels.length) {
                    progressEntry.completed = true;
                    progressEntry.level = badge.levels.length;
                }
                user.badges.push(badge._id);
            }
        }

        // Save user progress
        await user.save();
    } catch (error) {
        throw new BadRequestError(error.message);
    }
}

async function trackActivity(userId, activityType, increment = 1) {
    await updateUserProgress(userId, activityType, increment);
}

export { trackActivity };