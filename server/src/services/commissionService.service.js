import CommissionService from "../models/commissionService.model.js";
import ServiceCategory from "../models/serviceCategory.model.js";
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

class CommissionServiceService {
    static createCommissionService = async (talentId, req) => {
        // 1. Check talent exists
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (talent.role !== "talent")
            throw new BadRequestError("Chỉ họa sĩ mới được tạo dịch vụ");

        // 2. Validate request body
        const {
            title,
            serviceCategoryId,
            termOfServiceId,
            movementId,
            minPrice,
            deliverables,
        } = req.body;
        if (!req.files || !req.files.files) {
            throw new BadRequestError("Bạn chưa cung cấp file ảnh");
        }
        if (
            !title ||
            !serviceCategoryId ||
            !minPrice ||
            !deliverables ||
            !termOfServiceId ||
            !movementId
        ) {
            throw new BadRequestError("Hãy cung cấp đầy đủ những thông tin bắt buộc");
        }

        // 3. Upload files to Cloudinary (compressed) and get their URLs
        try {
            const uploadPromises = req.files.files.map((file) =>
                compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/commissionServices/${talentId}`,
                    width: 1920,
                    height: 1080,
                })
            );
            const uploadResults = await Promise.all(uploadPromises);

            // Generate URLs
            const artworks = uploadResults.map((result) => result.secure_url);

            // 4. Create and save commission service
            let service = new CommissionService({
                talentId,
                title,
                serviceCategoryId,
                termOfServiceId,
                movementId,
                minPrice,
                deliverables,
                artworks,
            });
            await service.save();

            // Populate talentId field with stageName and avatar
            service = await service.populate("talentId", "stageName avatar");

            return {
                commissionService: service,
            };
        } catch (error) {
            console.error("Error uploading images:", error);
            throw new Error("Tạo dịch vụ không thành công");
        }
    };

    static readCommissionService = async (commissionServiceId) => {
        // 1. Check service
        const service = await CommissionService.findById(commissionServiceId)
            .populate("talentId", "stageName avatar")
            .populate("termOfServiceId");
        if (!service) throw new NotFoundError("Dịch vụ không tồn tại");

        // 2. Update views
        service.views += 1;
        await service.save();

        // 3. Read service
        return {
            commissionService: service,
        };
    };

    static readCommissionServices = async (talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Không tìm thấy họa sĩ");
        if (talent.role !== "talent")
            throw new BadRequestError("Không tìm thấy họa sĩ");

        //2. Find services
        const services = await CommissionService.find({
            talentId: talentId,
        }).populate("talentId", "stageName avatar");

        return {
            commissionServices: services,
        };
    };

    static updateCommissionService = async (
        talentId,
        commissionServiceId,
        req
    ) => {
        // 1. Check talent and service
        const talent = await User.findById(talentId)
        const service = await CommissionService.findById(commissionServiceId)
    
        if (!talent) throw new NotFoundError('Không tìm thấy họa sĩ')
        if (!service) throw new NotFoundError('Dịch vụ không tồn tại')
        if (!service.movementId) throw new NotFoundError('Trường phái không tồn tại')
        if (service.talentId.toString() !== talentId) throw new BadRequestError('Bạn không có quyền thực hiện thao tác này')
    
        const oldCategoryId = service.serviceCategoryId // Store the old category ID
        try {
            // 2. Handle file uploads if new files were uploaded
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload new files to Cloudinary
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/commissionServices/${talentId}`,
                        width: 1920,
                        height: 1080,
                    })
                );
                const uploadResults = await Promise.all(uploadPromises);
                const artworks = uploadResults.map(
                    (result) => result.secure_url
                );
                req.body.artworks = artworks;

                // Delete old files from Cloudinary
                const publicIds = service.artworks.map((artwork) =>
                    extractPublicIdFromUrl(artwork)
                );
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                );
            }

            // 3. Merge existing service fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = { ...service.toObject(), ...req.body };

            // 4. Update the service
            const updatedService = await CommissionService.findByIdAndUpdate(
                commissionServiceId,
                updatedFields,
                { new: true }
            );

            // 5. Check if the category has changed and if the old category is now empty
            if (
                oldCategoryId &&
                oldCategoryId.toString() !==
                    updatedService.serviceCategoryId.toString()
            ) {
                const servicesInOldCategory = await CommissionService.find({
                    serviceCategoryId: oldCategoryId,
                });
                if (servicesInOldCategory.length === 0) {
                    await ServiceCategory.findByIdAndDelete(oldCategoryId);
                }
            }

            return {
                commissionService: updatedService,
            };
        } catch (error) {
            console.log("Error in updating commission service:", error);
            throw new Error("Cập nhật dịch vụ không thành công");
        }
    };

    static deleteCommissionService = async (talentId, commissionServiceId) => {
        // 1. Check talent and service
        const talent = await User.findById(talentId);
        const service = await CommissionService.findById(commissionServiceId);

        if (!talent) throw new NotFoundError("Không tìm thấy họa sĩ");
        if (!service) throw new NotFoundError("Dịch vụ không tồn tại");
        if (service.talentId.toString() !== talentId)
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này");

        // 2. Extract public IDs and delete files from Cloudinary
        const publicIds = service.artworks.map((artwork) =>
            extractPublicIdFromUrl(artwork)
        );
        await Promise.all(
            publicIds.map((publicId) => deleteFileByPublicId(publicId))
        );

        // 4. Delete the service from the database
        const serviceCategoryId = service.serviceCategoryId;
        await service.deleteOne();

        // 5. Check if the category has other services
        const remainingServices = await CommissionService.find({
            serviceCategoryId,
        });
        if (remainingServices.length === 0) {
            await ServiceCategory.findByIdAndDelete(serviceCategoryId);
        }

        return {
            message: "Xóa dịch vụ thành công",
        };
    };
}

export default CommissionServiceService;
