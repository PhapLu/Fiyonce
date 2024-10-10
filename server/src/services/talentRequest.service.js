import TalentRequest from "../models/talentRequest.model.js"
import crypto from 'crypto'
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
import {sendAnnouncementEmail} from "../configs/brevo.email.config.js"

class TalentRequestService {
    static requestUpgradingToTalent = async (userId, req) => {
        // 1. Check user exists and is not a talent
        const currentUser = await User.findById(userId)
        if (!currentUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (currentUser.role === "talent")
            throw new BadRequestError("Bạn đã là họa sĩ")

        // 2. Validate request body
        let taxCode = ''
        let cccd = ''
        if (req.body.taxCode) {
            taxCode = req.body.taxCode
        }
        if (req.body.cccd) {
            cccd = req.body.cccd
        }
        const { stageName, jobTitle, portfolioLink } = req.body
        if (!req.files || !req.files.files)
            throw new BadRequestError("Hãy nhập đầy đủ những thông tin cần thiết")
        if (!userId || !stageName || !jobTitle || !portfolioLink)
            throw new BadRequestError("Hãy nhập đầy đủ những thông tin cần thiết")

        // 3. Check if user has requested before
        const talentRequest = await TalentRequest.findOne({ userId })
        if (talentRequest) {
            // Extract the artwork public_id by using cloud util function
            const publicIds = talentRequest.artworks.map((artwork) =>
                extractPublicIdFromUrl(artwork)
            )
            // Delete the files from Cloudinary
            await Promise.all(
                publicIds.map((publicId) => deleteFileByPublicId(publicId))
            )
            // Delete the request from database
            await talentRequest.deleteOne()
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
            )
            const uploadResults = await Promise.all(uploadPromises)
            const artworks = uploadResults.map((result) => result.secure_url)

            // 5. Create and save talent request
            const newTalentRequest = new TalentRequest({
                userId,
                ...req.body
            })
            await newTalentRequest.save()

            //6. Send email to admin
            try {
                const subject = '[PASTAL] - Yêu cầu nâng cấp tài khoản họa sĩ'
                const subSubject = 'Có yêu cầu nâng cấp tài khoản họa sĩ mới từ ' + currentUser.email
                const message = `Có yêu cầu nâng cấp tài khoản họa sĩ mới từ ' + ${currentUser.email}`
                sendAnnouncementEmail(
                    'phapluudev2k5@gmail.com',
                    subject,
                    subSubject,
                    message
                )
                sendAnnouncementEmail(
                    'nhatluudev@gmail.com',
                    subject,
                    subSubject,
                    message
                )
            } catch (error) {
                console.log("Failed:::", error)
                throw new BadRequestError("Email service error")
            }
            return {
                talentRequest: newTalentRequest,
            }
        } catch (error) {
            console.log("Error uploading images:", error)
            throw new Error("File upload or database save failed")
        }
    }

    static requestSupplement = async (userId, body) => {
        // 1. Check user exists
        const currentUser = await User.findById(userId)
        if (!currentUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        // 2. Find talent request
        const talentRequest = await TalentRequest.findOne({ userId })
        if (!talentRequest) {
            throw new NotFoundError("Không tìm thấy yêu cầu nâng cấp")
        }

        // 3. Validate request body
        if (!body.cccd && !body.taxCode)
            throw new BadRequestError("Hãy nhập thông tin cần bổ sung")
        talentRequest.cccd = body.cccd
        talentRequest.taxCode = body.taxCode
        talentRequest.status = "pending"

        // 4. Save the updated request
        await talentRequest.save()

        return {
            talentRequest,
        }
    }

    static readMyTalentRequest = async (userId) => {
        // 1. Check user exists
        const currentUser = await User.findById(userId)
        if (!currentUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        // 2. Find talent request
        const talentRequest = await TalentRequest.findOne({ userId }).populate("userId", "fullName email")
        if (!talentRequest) {
            throw new NotFoundError("Không tìm thấy yêu cầu nâng cấp")
        }

        return {
            myTalentRequest: talentRequest
        }
    }

    //------------------Admin----------------------------------------------------------
    static upgradeRoleToTalent = async (adminId, requestId) => {
        // 1. Find and check request
        const request = await TalentRequest.findById(requestId)
        if (!request) throw new NotFoundError("Không tìm thấy yêu cầu nâng cấp")
        if (request.status === "approved")
            throw new BadRequestError("Yêu cầu nâng cấp đã được chấp thuận")

        // 2. Find and check admin user and user role
        const adminUser = await User.findById(adminId)
        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        // 3. Find and check the user related to the request
        const userId = request.userId
        const foundUser = await User.findById(userId)
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        // 4. Mark request as approved
        request.status = "approved"
        await request.save()

        // 5. Update role to talent
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { role: "talent" } },
            { new: true }
        )
        updatedUser.jobTitle = request.jobTitle
        updatedUser.stageName = request.stageName
        if (request.taxCode) {
            updatedUser.taxCode = request.taxCode
        }
        if (request.cccd) {
            updatedUser.cccd = request.cccd
        }
        updatedUser.save()

        // 6. Exclude password from user object
        const { password: hiddenPassword, ...userWithoutPassword } = updatedUser

        // 7. Send email to user and delete images in cloudinary
        try {
            const subject =  '[PASTAL] - Nâng cấp tài khoản thành công'
            const message = 'Chúc mừng! yêu cầu nâng cấp tài khoản họa sĩ của bạn đã chấp thuận'
            const orderCode = ''
            const reason = ''
            sendAnnouncementEmail(
                userWithoutPassword._doc.email,
                subject,
                message,
                orderCode,
                reason
            )
            return {
                user: userWithoutPassword._doc,
            }
        } catch (error) {
            console.log("Failed:::", error)
            throw new BadRequestError("Email service error or image deletion failed")
        }
    }

    static denyTalentRequest = async (adminId, requestId, body) => {
        //1. Find and check request
        const request = await TalentRequest.findById(requestId)
        if (!request) throw new NotFoundError("Không tìm thấy yêu cầu nâng cấp")
        if (request.status === "rejected")
            throw new BadRequestError("Yêu cầu nâng cấp này đã bị từ chối")
        if (!body.rejectMessage || body.rejectMessage === '')
            throw new BadRequestError("Hãy cung cấp lí do từ chối")

        //2. Find and check admin, user and user role
        const userId = request.userId
        const adminUser = await User.findById(adminId)
        const foundUser = await User.findById(userId)

        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        //3. Mark request as denied
        if (request.taxCode) {
            foundUser.taxCode = body.taxCode
        }
        request.status = "rejected"
        request.rejectMessage = body.rejectMessage;
        await request.save()

        //4. Send email to user and delete images in cloudinary
        try {
            request.artworks.forEach(async (artwork) => {
                const publicId = extractPublicIdFromUrl(artwork)
                await deleteFileByPublicId(publicId)
            })
            const subject = 'Yêu cầu nâng cấp tài khoản họa sĩ của bạn đã bị từ chối'
            const message = 'Yêu cầu nâng cấp tài khoản họa sĩ của bạn đã bị từ chối'
            const reason = 'Lí do: ' + body.rejectMessage
            sendAnnouncementEmail(
                foundUser.email,
                subject,
                message,
                reason
            )
            return {
                success: true,
                message: "Request denied successfully",
                user: foundUser
            }
        } catch (error) {
            console.log("Failed:::", error)
            throw new Error("Email service error or image deletion failed")
        }
    }

    static readTalentRequestsByStatus = async (adminId, status) => {
        //1. Check admin account
        const adminUser = await User.findById(adminId)
        if (!adminUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        //2. Find all talent requests
        const talentRequests = await TalentRequest.find({})
            .populate("userId", "email fullName")
        return {
            talentRequests,
        }
    }

    static readTalentRequest = async (adminId, requestId) => {
        //1. Check admin account
        const adminUser = await User.findById(adminId)
        if (!adminUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!adminUser || adminUser.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        //2. Find talent request by id
        const talentRequest = await TalentRequest.findById(requestId)
        if (!talentRequest) throw new NotFoundError("Không tìm thấy yêu cầu nâng cấp")
        return {
            talentRequest,
        }
    }

    static readReferralCodeOwner = async (referralCode) => {
        //1. Find the user who owns the referral code
        const user = await User.findOne({ referralCode })
        if (!user) throw new NotFoundError("User not found")

        return {
            user,
        }
    }
}

export default TalentRequestService
