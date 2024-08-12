import BugReport from "../models/bugReport.model.js"
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

class BugReportService {
    static createBugReport = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found")

        //2. Validate request body
        const { content } = req.body

        //3. Upload files to Cloudinary if exists
        try {
            let evidences = []
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload files to Cloudinary
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/bugReports/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                evidences = uploadResults.map((result) => result.secure_url)
            }

            //4. Create bugReport
            const bugReport = new BugReport({
                userId: userId,
                content,
                evidences,
            })
            await bugReport.save()

            return {
                bugReport,
            }
        } catch (error) {
            console.log("Error uploading images or saving order:", error)
            throw new BadRequestError("File upload or database save failed")
        }
    }

    static readBugReport = async (bugReportId) => {
        //1. Check bugReport
        const bugReport = await BugReport.findById(
            bugReportId
        ).populate("userIdReported", "fullName avatar")
        if (!bugReport)
            throw new NotFoundError("Commission Report not found")

        //2. Return bugReport
        return {
            bugReport,
        }
    }

    static readBugReports = async (userId) => {
        //1. Check user as an admin
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found")
        if (user.role !== "admin")
            throw new AuthFailureError("User not authorized")

        //2. Get all bugReports
        const bugReports = await BugReport.find()

        return {
            bugReports,
        }
    }

    static updateBugReport = async (userId, bugReportId, req) => {
        //1. Check user and bugReport
        const user = await User.findById(userId)
        const bugReport = await BugReport.findById(bugReportId)

        if (!user) throw new NotFoundError("User not found")
        if (!bugReport)
            throw new NotFoundError("Commission Report not found")
        if (bugReport.userId.toString() !== userId)
            throw new AuthFailureError(
                "You can only update your account report"
            )

        //2. Handle file uploads if new files were uploaded
        try {
            //3. Upload files to Cloudinary if exists
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload files to Cloudinary
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/bugReports/${userId}`,
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
                const publicIds = bugReport.evidences.map((evidence) =>
                    extractPublicIdFromUrl(evidence)
                )
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                )
            }

            // 3. Merge existing service fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = {
                ...bugReport.toObject(),
                ...req.body,
            }

            //5. Update bugReport
            const updatedBugReport = await BugReport.findByIdAndUpdate(
                bugReportId,
                updatedFields,
                { new: true }
            )

            return {
                bugReport: updatedBugReport,
            }
        } catch (error) {
            console.log("Error uploading images or saving order:", error)
            throw new BadRequestError("File upload or database save failed")
        }
    }

    static deleteBugReport = async (userId, bugReportId) => {
        //1. Check user and bugReport
        const user = await User.findById(userId)
        const bugReport = await BugReport.findById(bugReportId)
        if (!user) throw new NotFoundError("User not found")
        if (!bugReport)
            throw new NotFoundError("Commission Report not found")
        if (bugReport.userId.toString() !== userId)
            throw new AuthFailureError(
                "You can only delete your account report"
            )

        // 2. Extract public IDs and delete files from Cloudinary
        const publicIds = bugReport.evidences.map((evidence) =>
            extractPublicIdFromUrl(evidence)
        )
        await Promise.all(
            publicIds.map((publicId) => deleteFileByPublicId(publicId))
        )

        // 3. Delete the bugReport from the database
        await bugReport.deleteOne()

        return {
            message: "Commission Report deleted successfully",
        }
    }
}

export default BugReportService
