import jwt from 'jsonwebtoken'
import Artwork from '../models/artwork.model.js'
import { User } from '../models/user.model.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import Conversation from '../models/conversation.model.js'
import Notification from '../models/notification.model.js'
import mongoose from 'mongoose'

class UserService {
    //-------------------CRUD----------------------------------------------------
    static updateProfile = async (userId, body) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if(userId !== user._id.toString()) 
            throw new AuthFailureError("Bạn chỉ có thể cập nhật thông tin cá nhân của bản thân")
        
        //2. Validate body
        if( body._id || body.email || body.role || body.password
            || body.accessToken || body.qrCode  || body.status
            || body.followers || body.following || body.views
            ) 
            throw new BadRequestError("Không thể cập nhật thông tin này")
        if(user.role !== 'talent' && body.jobTitle)
            throw new BadRequestError("Chỉ tài khoản họa sĩ mới có thể cập nhật nghề nghiệp")
        
        //3. Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: body },
            { new: true }
        ).select("-password")

        return {
            user: updatedUser,
        };
    };

    static readUserProfile = async (profileId) => {
        //1. Check user
        const userProfile = await User.findById(profileId).select("-password -accessToken");
        if (!userProfile)
            throw new NotFoundError("Không tìm thấy người này");

        //2. Update views
        userProfile.views += 1;
        await userProfile.save();

        //3. Return user profile
        return {
            user: userProfile,
        };
    };

    static deleteProfile = async (userId) => {
        //1. Check user
        const userProfile = await User.findById(userId);
        if (!userProfile) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (userProfile._id.toString() !== userId)
            throw new AuthFailureError("Bạn chỉ có thể xóa profile của bản thân");

        //2. Delete profile
        await User.findByIdAndDelete(userId);
        return { success: true, message: "Xóa profile thành công" };
    };
    //-------------------END CRUD----------------------------------------------------

    static followUser = async (userId, profileId) => {
        //1. Check user and follow
        const currentUser = await User.findById(userId).select("-password");
        const followedUser = await User.findById(profileId);
        if (!currentUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!followedUser) throw new NotFoundError("Không tìm thấy người này");
        if(userId == profileId) throw new BadRequestError("Bạn không thể theo dõi bản thân");
        if (currentUser.following.includes(profileId))
            throw new BadRequestError("Bạn đã theo dõi người này");

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
        if (!currentUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!followedUser) throw new NotFoundError("Không tìm thấy người này");
        if (!currentUser.following.includes(profileId))
            throw new BadRequestError("Bạn không theo dõi người này");

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
        if (!decoded) throw new AuthFailureError("Token không hợp lệ");

        // 2. Find user
        const userId = decoded.id;
        if (!userId) throw new AuthFailureError("Token không hợp lệ");

        // 3. Return user without password
        const user = await User.findById(userId).select("-password");
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");

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
