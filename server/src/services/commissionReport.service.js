import CommissionReport from "../models/commissionReport.model.js";
import { User } from "../models/user.model.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";
import {
    compressAndUploadImage,
    extractPublicIdFromUrl,
    deleteFileByPublicId,
} from "../utils/cloud.util.js";

class CommissionReportService {
    static createCommissionReport = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("User not found");

        //2. Validate request body
        const { orderId, proposalId, content } = req.body;
        if (!orderId || !proposalId || !content)
            throw new BadRequestError("Please provide all required fields");

        //3. Upload files to Cloudinary if exists
        try {
            let evidences = [];
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
                );
                const uploadResults = await Promise.all(uploadPromises);
                evidences = uploadResults.map((result) => result.secure_url);
            }

            //4. Create commissionReport
            const commissionReport = new CommissionReport({
                clientId: userId,
                orderId,
                proposalId,
                content,
                evidences,
            });
            await commissionReport.save();

            return {
                commissionReport,
            };
        } catch (error) {
            console.log("Error uploading images or saving order:", error);
            throw new Error("File upload or database save failed");
        }
    };

    static readCommissionReport = async (commissionReportId) => {
        //1. Check commissionReport
        const commissionReport = await CommissionReport.findById(
            commissionReportId
        ).populate("orderId", "memberId talentChosenId");
        if (!commissionReport)
            throw new NotFoundError("Commission Report not found");

        //2. Return commissionReport
        return {
            commissionReport,
        };
    };

    static readCommissionReports = async (userId) => {
        //1. Check user as an admin
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("User not found");
        if (user.role !== "admin")
            throw new AuthFailureError("User not authorized");

        //2. Get all commissionReports
        const commissionReports = await CommissionReport.find();

        return {
            commissionReports,
        };
    };

    static updateCommissionReport = async (userId, commissionReportId, req) => {
        //1. Check user and commissionReport
        const user = await User.findById(userId);
        const commissionReport = await CommissionReport.findById(
            commissionReportId
        );

        if (!user) throw new NotFoundError("User not found");
        if (!commissionReport)
            throw new NotFoundError("Commission Report not found");
        if (commissionReport.clientId.toString() !== userId)
            throw new AuthFailureError(
                "You can only update your commission report"
            );

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
                );
                const uploadResults = await Promise.all(uploadPromises);
                const evidences = uploadResults.map(
                    (result) => result.secure_url
                );
                req.body.evidences = evidences;

                // Delete old files from Cloudinary
                const publicIds = commissionReport.evidences.map((evidence) =>
                    extractPublicIdFromUrl(evidence)
                );
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                );
            }

            // 3. Merge existing service fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = {
                ...commissionReport.toObject(),
                ...req.body,
            };

            //5. Update commissionReport
            const updatedCommissionReport =
                await CommissionReport.findByIdAndUpdate(
                    commissionReportId,
                    updatedFields,
                    { new: true }
                );

            return {
                commissionReport: updatedCommissionReport,
            };
        } catch (error) {}
    };

    static deleteCommissionReport = async (userId, commissionReportId) => {
        //1. Check user and commissionReport
        const user = await User.findById(userId);
        const commissionReport = await CommissionReport.findById(
            commissionReportId
        );
        if (!user) throw new NotFoundError("User not found");
        if (!commissionReport)
            throw new NotFoundError("Commission Report not found");
        if (commissionReport.clientId.toString() !== userId)
            throw new AuthFailureError(
                "You can only delete your commission report"
            );

        // 2. Extract public IDs and delete files from Cloudinary
        const publicIds = commissionReport.evidences.map((evidence) =>
            extractPublicIdFromUrl(evidence)
        );
        await Promise.all(
            publicIds.map((publicId) => deleteFileByPublicId(publicId))
        );

        // 3. Delete the commissionReport from the database
        await commissionReport.deleteOne();

        return {
            message: "Commission Report deleted successfully",
        };
    };
}

export default CommissionReportService;
