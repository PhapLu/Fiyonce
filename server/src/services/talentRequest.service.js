import TalentRequest from "../models/talentRequest.model.js";
import { User } from "../models/user.model.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";
import {
    compressAndUploadImage,
    deleteFileByPublicId,
    extractPublicIdFromUrl,
} from "../utils/cloud.util.js";
import brevoSendEmail from "../configs/brevo.email.config.js";

class TalentRequestService {
    static requestUpgradingToTalent = async (userId, req) => {
        // 1. Check user exists and is not a talent
        const currentUser = await User.findById(userId);
        if (!currentUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (currentUser.role === "talent")
            throw new BadRequestError("Bạn đã là họa sĩ");

        // 2. Validate request body
        const { stageName, jobTitle, portfolioLink } = req.body;
        if (!req.files || !req.files.files)
            throw new BadRequestError("Hãy nhập đầy đủ những thông tin bắt buộc");
        if (!userId || !stageName || !jobTitle || !portfolioLink)
            throw new BadRequestError("Hãy nhập đầy đủ những thông tin bắt buộc");

        // 3. Check if user has requested before
        const talentRequest = await TalentRequest.findOne({ userId });
        if (talentRequest) {
            // Extract the artwork public_id by using cloud util function
            const publicIds = talentRequest.artworks.map((artwork) =>
                extractPublicIdFromUrl(artwork)
            );
            // Delete the files from Cloudinary
            await Promise.all(
                publicIds.map((publicId) => deleteFileByPublicId(publicId))
            );
            // Delete the request from database
            await TalentRequest.deleteOne({ userId });
        }

        // 4. Upload files to Cloudinary (compressed)
        try {
            const uploadPromises = req.files.files.map((file) =>
                compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/talentRequests/${userId}`,
                    width: 1920,
                    height: 1080,
                })
            );
            const uploadResults = await Promise.all(uploadPromises);
            const artworks = uploadResults.map((result) => result.secure_url);

            // 5. Create and save talent request
            const newTalentRequest = new TalentRequest({
                userId,
                stageName,
                jobTitle,
                portfolioLink,
                artworks,
            });
            await newTalentRequest.save();

            return {
                talentRequest: newTalentRequest,
            };
        } catch (error) {
            console.log("Error uploading images:", error);
            throw new BadRequestError("Gửi yêu cầu họa sĩ không thành công");
        }
    };

    static readTalentRequestStatus = async (userId) => {
        // 1. Check user exists
        const currentUser = await User.findById(userId);
        if (!currentUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");

        // 2. Find talent request
        const talentRequest = await TalentRequest.findOne({ userId });
        if (!talentRequest) {
            throw new NotFoundError("Yêu cầu họa sĩ không tồn tại");
        }

        return {
            talentRequestStatus: talentRequest,
        };
    };

    //------------------Admin----------------------------------------------------------
    static upgradeRoleToTalent = async (adminId, requestId) => {
        // 1. Find and check request
        const request = await TalentRequest.findById(requestId);
        if (!request) throw new NotFoundError("Yêu cầu không tồn tại");
        if (request.status === "approved")
            throw new BadRequestError("Yêu cầu này đã được chấp nhận");

        // 2. Find and check admin user and user role
        const adminUser = await User.findById(adminId);
        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");

        // 3. Find and check the user related to the request
        const userId = request.userId;
        const foundUser = await User.findById(userId);
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (foundUser.role === "talent")
            throw new BadRequestError("Người này đã là họa sĩ");

        // 4. Mark request as approved
        request.status = "approved";
        await request.save();

        // 5. Update role to talent
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { role: "talent" } },
            { new: true }
        ).select("-password");

        // 6. Exclude password from user object
        const { password: hiddenPassword, ...userWithoutPassword } =
            updatedUser;

        // 7. Send email to user and delete images in cloudinary
        try {
            request.artworks.forEach(async (artwork) => {
                const publicId = extractPublicIdFromUrl(artwork);
                await deleteFileByPublicId(publicId);
            });
            await brevoSendEmail( foundUser.email, "Nâng cấp tài khoản họa sĩ", "Tài khoản của bạn đã được nâng cấp thành họa sĩ");
        } catch (error) {
            throw new BadRequestError("Nâng cấp tài khoản không thành công");
        }

        return {
            user: userWithoutPassword._doc,
        };
    };

    static denyTalentRequest = async (adminId, requestId) => {
        //1. Find and check request
        const request = await TalentRequest.findById(requestId);
        if (!request) throw new NotFoundError("Yêu cầu không tồn tại");
        if (request.status === "rejected")
            throw new BadRequestError("Yêu cầu này đã bị từ chối");

        //2. Find and check admin, user and user role
        const userId = request.userId;
        const adminUser = await User.findById(adminId);
        const foundUser = await User.findById(userId);

        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (foundUser.role === "talent")
            throw new BadRequestError("Người này đã là họa sĩ");

        //3. Mark request as denied
        request.status = "rejected";
        await request.save();

        //4. Send email to user and delete images in cloudinary
        try {
            request.artworks.forEach(async (artwork) => {
                const publicId = extractPublicIdFromUrl(artwork);
                await deleteFileByPublicId(publicId);
            });
            await brevoSendEmail(foundUser.email, "Từ chối nâng cấp tài khoản họa sĩ", "Yêu cầu nâng cấp thành họa sĩ bạn đã bị từ chối");
        } catch (error) {
            console.log("Failed:::", error);
            throw new BadRequestError("Từ chối yêu cầu không thành công");
        }

        return {
            success: true,
            message: "Từ chối yêu cầu họa sĩ thành công",
        };
    };

    static readTalentRequestsByStatus = async (adminId, status) => {
        //1. Check admin account
        const adminUser = await User.findById(adminId);
        if (!adminUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");

        //2. Find all talent requests
        const talentRequests = await TalentRequest.find({
            status: status,
        }).populate("userId", "email fullName");
        return {
            talentRequests,
        };
    };

    static readTalentRequest = async (adminId, requestId) => {
        //1. Check admin account
        const adminUser = await User.findById(adminId);
        if (!adminUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");

        //2. Find talent request by id
        const talentRequest = await TalentRequest.findById(requestId);
        if (!talentRequest) throw new NotFoundError("Yêu cầu không tồn tại");
        return {
            talentRequest,
        };
    };
}

export default TalentRequestService;
