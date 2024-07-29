import jwt from 'jsonwebtoken'
import Artwork from '../models/artwork.model.js'
import { User } from '../models/user.model.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import Conversation from '../models/conversation.model.js'
import Notification from '../models/notification.model.js'
import mongoose from 'mongoose'

class UserService {
    //-------------------CRUD----------------------------------------------------
    static updateProfile = async (userId, profileId, body) => {
        //1. Check user
        const profile = await User.findById(profileId);
        if (!profile) throw new NotFoundError("User not found");
        if (profileId != userId)
            throw new AuthFailureError("You can only update your account");

        //2. Update user
        const updatedUser = await User.findByIdAndUpdate(
            profileId,
            { $set: body },
            { new: true }
        );
        return {
            user: updatedUser,
        };
    };

    static readUserProfile = async (profileId) => {
        //1. Check user
        const userProfile = await User.findById(profileId);
        if (!userProfile)
            throw new NotFoundError("User not found").select("-password");
        
        //2. Update views
        userProfile.views += 1;
        await userProfile.save();

        //3. Return user profile
        return {
            user: userProfile,
        };
    };

    static deleteProfile = async (userId, profileId) => {
        //1. Check user and profile
        const userProfile = await User.findById(profileId);
        if (!userProfile) throw new NotFoundError("User not found");
        if (userId.toString() != profileId)
            throw new AuthFailureError("You can only delete your account");

        //2. Delete profile
        await User.findByIdAndDelete(profileId);
        return { success: true, message: "User deleted successfully" };
    };


    static followUser = async (userId, profileId) => {
        //1. Check user and follow
        const currentUser = await User.findById(userId);
        const followedUser = await User.findById(profileId);
        if (!currentUser) throw new NotFoundError("User not found");
        if (!followedUser) throw new NotFoundError("User not found");
        if (currentUser.following.includes(profileId))
            throw new BadRequestError("You already follow this user");

        //2. Follow user
        currentUser.following.push(profileId);
        followedUser.followers.push(userId);
        await currentUser.save();
        await followedUser.save();

        return {
            user: currentUser,
        };
    };

    static unFollowUser = async (userId, profileId) => {
        // 1. Check user and unfollow
        const currentUser = await User.findById(userId);
        const followedUser = await User.findById(profileId);
        if (!currentUser) throw new NotFoundError("User not found");
        if (!followedUser) throw new NotFoundError("User not found");
        if (!currentUser.following.includes(profileId))
            throw new BadRequestError("You do not follow this user");

        // 2. Unfollow user
        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== profileId.toString()
        );
        followedUser.followers = followedUser.followers.filter(
            (id) => id.toString() !== userId.toString()
        );
        await currentUser.save();
        await followedUser.save();
        return {
            user: currentUser,
        };
    };

    static me = async (accessToken) => {
        // 1. Decode accessToken and check
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        if (!decoded) throw new AuthFailureError("Invalid token");

        // 2. Find user
        const userId = decoded.id;
        if (!userId) throw new AuthFailureError("Invalid validation");

        // 3. Return user without password
        const user = await User.findById(userId).select("-password");
        if (!user) throw new NotFoundError("User not found");

        // Fetch unseen conversations
        const unSeenConversations = await Conversation.find({
            members: { $elemMatch: { user: userId } },
            "messages.createdAt": { $gt: user.lastViewConversations }
        }).populate('members.user messages.senderId seenBy.userId');

        // Fetch unseen notifications
        const unSeenNotifications = await Notification.find({
            receiverId: new mongoose.Types.ObjectId(userId),
            isSeen: false
        });

        // Create a plain JavaScript object with user data and add unSeenConversations
        const userData = {
            ...user.toObject(),
            unSeenConversations: unSeenConversations,
            unSeenNotifications: unSeenNotifications
        };

        return {
            user: userData,
        };
    };
}

export default UserService;
