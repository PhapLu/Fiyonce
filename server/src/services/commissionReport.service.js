import CommissionReport from "../models/commissionReport.model.js"
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
import Proposal from "../models/proposal.model.js"
import { sendAnnouncementEmail, sendReportEmail } from "../configs/brevo.email.config.js"
import { formatDate } from "../utils/index.js"

class CommissionReportService {
    static createCommissionReport = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Validate request body
        const { orderId, content } = req.body

        if (!orderId || !content)
            throw new BadRequestError("Hãy cung cấp những mục cần thiết")

        const order = await Order.findById(orderId)
        if (!order) throw new BadRequestError("Không tìm thấy đơn hàng")
        const proposal = await Proposal.findOne({ orderId: orderId, talentId: order.talentChosenId })
        if (!proposal) throw new BadRequestError("Bạn không thể báo cáo vi phạm ở giai đoạn này")
        
        //3. Upload files to Cloudinary if exists
        try {
            let evidences = []
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload files to Cloudinary
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/commissionReports/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                evidences = uploadResults.map((result) => result.secure_url)
            }

            //4. Create commissionReport
            const commissionReport = new CommissionReport({
                userId: userId,
                orderId,
                proposalId: proposal._id.toString(),
                content,
                evidences,
            })
            await commissionReport.save()

            order.status = "under_processing"
            await order.save()

            return {
                commissionReport,
            }
        } catch (error) {
            console.log("Error uploading images or saving order:", error)
            throw new Error("File upload or database save failed")
        }
    }

    static readCommissionReport = async (commissionReportId) => {
        //1. Check commissionReport
        const commissionReport = await CommissionReport.findById(
            commissionReportId
        ).populate("orderId").populate("proposalId")
        if (!commissionReport)
            throw new NotFoundError("Không tìm thấy báo cáo")

        //2. Return commissionReport
        return {
            commissionReport,
        }
    }

    static readCommissionReports = async (userId) => {
        //1. Check user as an admin
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== "admin")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        //2. Get all commissionReports
        const commissionReports = await CommissionReport.find().populate("orderId").populate("proposalId")

        return {
            commissionReports,
        }
    }

    static updateCommissionReport = async (userId, commissionReportId, req) => {
        //1. Check user and commissionReport
        const user = await User.findById(userId)
        const commissionReport = await CommissionReport.findById(
            commissionReportId
        )

        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!commissionReport)
            throw new NotFoundError("Không tìm thấy báo cáo")
        if (commissionReport.userId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
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
                        folderName: `fiyonce/commissionReports/${userId}`,
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
                const publicIds = commissionReport.evidences.map((evidence) =>
                    extractPublicIdFromUrl(evidence)
                )
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                )
            }

            // 3. Merge existing service fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = {
                ...commissionReport.toObject(),
                ...req.body,
            }

            //5. Update commissionReport
            const updatedCommissionReport =
                await CommissionReport.findByIdAndUpdate(
                    commissionReportId,
                    updatedFields,
                    { new: true }
                )

            return {
                commissionReport: updatedCommissionReport,
            }
        } catch (error) {
            console.log("Error uploading images or saving order:", error)
            throw new BadRequestError("File upload or database save failed")
        }
    }

    static deleteCommissionReport = async (userId, commissionReportId) => {
        //1. Check user and commissionReport
        const user = await User.findById(userId)
        const commissionReport = await CommissionReport.findById(
            commissionReportId
        )
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!commissionReport)
            throw new NotFoundError("Không tìm thấy báo cáo")
        if (commissionReport.userId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        // 2. Extract public IDs and delete files from Cloudinary
        const publicIds = commissionReport.evidences.map((evidence) =>
            extractPublicIdFromUrl(evidence)
        )
        await Promise.all(
            publicIds.map((publicId) => deleteFileByPublicId(publicId))
        )

        // 3. Delete the commissionReport from the database
        await commissionReport.deleteOne()

        return {
            message: "Xóa báo cáo thành công",
        }
    }

    static adminReceiveReport = async (userId, commissionReportId) => {
        //1. Check if user, commissionReport exists
        const user = await User.findById(userId);
        const commissionReport = await CommissionReport.findById(commissionReportId)
        const order = await Order.findById(commissionReport.orderId)
        .populate("memberId", "email")
        .populate("talentChosenId", "email")

        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (user.role !== "admin") throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");
        if (!commissionReport) throw new NotFoundError("Không tìm thấy đơn hàng");

        //2. Send email to user
        const subject = `[PASTAL] - Báo cáo vi phạm (${formatDate()})`
        const message = `Admin đã tiếp nhận yêu cầu xử lí vi phạm`
        const orderCode = `Mã đơn hàng: ${order._id.toString()}`
        const reason = `Nội dung vi phạm: ${commissionReport.content}`
        sendAnnouncementEmail(order.memberId.email, subject, message, orderCode, reason);
        sendAnnouncementEmail(order.talentChosenId.email, subject, message, orderCode, reason);

        return {
            commissionReport,
        };
    }

    static adminMakeDecision = async( userId, commissionReportId, body) => {
        //1. Check if user, commissionReport exists
        const user = await User.findById(userId);
        const commissionReport = await CommissionReport.findById(commissionReportId)
        const order = await Order.findById(commissionReport.orderId)
        .populate("memberId", "email")
        .populate("talentChosenId", "email")

        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (user.role !== "admin") throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng");
        if (!commissionReport) throw new NotFoundError("Không tìm thấy báo cáo");

        //2. Update commissionReport, order
        commissionReport.adminDecision = { 
            decision: body.decision, 
            reason: body.reason, 
            notified: true 
        };
        order.status = "resolved";
        await order.save()
        await commissionReport.save();

        //3. Send email to user and talents
        const subject = `[PASTAL] - Thông báo về việc xử lí vi phạm (${formatDate()})`
        const message = `Admin đã xử lí báo cáo vi phạm`
        const orderCode = `Mã đơn hàng: ${order._id.toString()}`
        const reason = `Nội dung vi phạm: ${commissionReport.content}`
        sendReportEmail(order.memberId.email, subject, message, reason);
        sendReportEmail(order.talentChosenId.email, subject, message, reason);

        return {
            commissionReport,
        };
    }
}

export default CommissionReportService
