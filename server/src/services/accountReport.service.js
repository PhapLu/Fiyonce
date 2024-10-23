import AccountReport from "../models/accountReport.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import {
    compressAndUploadImage,
    extractPublicIdFromUrl,
    deleteFileByPublicId,
} from "../utils/cloud.util.js"
import Order from "../models/order.model.js"

class AccountReportService {
    static createAccountReport = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Validate request body
        const { userIdReported, content } = req.body
        const userReported = await User.findById(userIdReported)
        if (!userReported) throw new NotFoundError("Không tìm thấy báo cáo")

        //3. Upload files to Cloudinary if exists
        try {
            let evidences = []
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload files to Cloudinary
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/accountReports/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                evidences = uploadResults.map((result) => result.secure_url)
            }

            //4. Create accountReport
            const accountReport = new AccountReport({
                userId: userId,
                userIdReported,
                content,
                evidences,
            })
            await accountReport.save()

            return {
                accountReport
            }
        } catch (error) {
            console.log("Error uploading images or saving order:", error)
            throw new Error("File upload or database save failed")
        }
    }

    static readAccountReport = async (accountReportId) => {
        //1. Check accountReport
        const accountReport = await AccountReport.findById(
            accountReportId
        ).populate("userIdReported", "fullName avatar")
        if (!accountReport)
            throw new NotFoundError("Không tìm thấy báo cáo")

        //2. Return accountReport
        return {
            accountReport,
        }
    }

    static readAccountReports = async (userId) => {
        //1. Check user as an admin
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        //2. Get all accountReports
        const accountReports = await AccountReport.find()

        return {
            accountReports,
        }
    }

    static updateAccountReport = async (userId, accountReportId, req) => {
        //1. Check user and accountReport
        const user = await User.findById(userId)
        const accountReport = await AccountReport.findById(accountReportId)

        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!accountReport)
            throw new NotFoundError("Không tìm thấy báo cáo")
        if (accountReport.userId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )
        
        //2. Handle file uploads if new files were uploaded
        if(req.body.userIdReported)
            throw new BadRequestError("Bạn không thể thay đổi trường thông tin này")
        try {
            //3. Upload files to Cloudinary if exists
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload files to Cloudinary
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/accountReports/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                const evidences = uploadResults.map(
                    (result) => result.secure_url
                )
                req.body.evidences = evidences

                // Delete old files from Cloudinary
                const publicIds = accountReport.evidences.map((evidence) =>
                    extractPublicIdFromUrl(evidence)
                )
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                )
            }

            // 3. Merge existing service fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = {
                ...accountReport.toObject(),
                ...req.body,
            }

            //5. Update accountReport
            const updatedAccountReport = await AccountReport.findByIdAndUpdate(
                accountReportId,
                updatedFields,
                { new: true }
            )

            return {
                accountReport: updatedAccountReport,
            }
        } catch (error) {
            console.log("Error uploading images or saving order:", error)
            throw new BadRequestError("File upload or database save failed")
        }
    }

    static deleteAccountReport = async (userId, accountReportId) => {
        //1. Check user and accountReport
        const user = await User.findById(userId)
        const accountReport = await AccountReport.findById(accountReportId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!accountReport)
            throw new NotFoundError("Không tìm thấy báo cáo")
        if (accountReport.userId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        // 2. Extract public IDs and delete files from Cloudinary
        const publicIds = accountReport.evidences.map((evidence) =>
            extractPublicIdFromUrl(evidence)
        )
        await Promise.all(
            publicIds.map((publicId) => deleteFileByPublicId(publicId))
        )

        // 3. Delete the accountReport from the database
        await accountReport.deleteOne()

        return {
            message: "Xóa báo cáo thành công",
        }
    }

    static adminMakeDecision = async (userId, accountReportId, req) => {
        //1. Check admin and accountReport
        const admin = await User.findById(userId)
        const accountReport = await AccountReport.findById(accountReportId)

        if (!admin) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!accountReport)
            throw new NotFoundError("Không tìm thấy báo cáo")
        if (admin.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        //2. Validate request body
        const { content, evidence } = req.body
        if (!content || !evidence)
            throw new BadRequestError("Vui lòng cung cấp đủ thông tin")

        //3. Update accountReport
        const updatedAccountReport = await AccountReport.findByIdAndUpdate(
            accountReportId,
            {
                adminDecision: {
                    decision: content,
                    reason: evidence,
                    notified: true,
                },
            },
            { new: true }
        )

        return {
            accountReport: updatedAccountReport,
        }
    }
}

export default AccountReportService
