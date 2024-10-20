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
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

class CommissionServiceService {
    static createCommissionService = async (talentId, req) => {
        // 1. Check talent exists
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Talent not found!");
        if (talent.role !== "talent")
            throw new BadRequestError("User is not a talent!");

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
            throw new BadRequestError("Please provide artwork files");
        }
        if (
            !title ||
            !serviceCategoryId ||
            !minPrice ||
            !deliverables ||
            !termOfServiceId ||
            !movementId
        ) {
            throw new BadRequestError("Please provide all required fields");
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
            throw new Error("File upload or database save failed");
        }
    };

    static readCommissionService = async (req, commissionServiceId) => {
        // 1. Check service
        const service = await CommissionService.findById(commissionServiceId)
            .populate("talentId", "fullName stageName avatar")
            .populate("termOfServiceId");

        if (!service) throw new NotFoundError("Service not found");

        const token = req.cookies.accessToken;

        // Initialize user-related variables
        let userId = null;
        let email = null;

        if (token) {
            // Verify token if it exists
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userId = payload.id;
            email = payload.email;
        }

        // If user is authenticated and not the service owner, increment the views
        if (userId && userId !== service.talentId.toString()) {
            service.views.push(userId);
        }

        // Save the service to update views
        await service.save();

        // 3. Read service
        return {
            commissionService: service,
        };
    };

    static readCommissionServices = async (talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Talent not found");
        if (talent.role !== "talent")
            throw new BadRequestError("He/She is not a talent");

        //2. Find services
        const services = await CommissionService.find({
            talentId: talentId,
        }).populate("talentId", "stageName avatar");

        return {
            commissionServices: services,
        };
    };

    static updateCommissionService = async (talentId, commissionServiceId, req) => {
        const talent = await User.findById(talentId);
        const service = await CommissionService.findById(commissionServiceId);

        if (!talent) throw new NotFoundError('Talent not found');
        if (!service) throw new NotFoundError('Service not found');
        if (!service.movementId) throw new NotFoundError('Movement not found');
        if (service.talentId.toString() !== talentId) throw new BadRequestError('You can only update your service');

        const oldCategoryId = service.serviceCategoryId;

        try {
            const updates = { ...req.body };

            // Handle file uploads if new files were uploaded
            if (req.files && req.files.files && req.files.files.length > 0) {
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
                const artworks = uploadResults.map((result) => result.secure_url);
                updates.artworks = artworks;

                // Delete old files from Cloudinary
                const publicIds = service.artworks.map((artwork) =>
                    extractPublicIdFromUrl(artwork)
                );
                await Promise.all(publicIds.map((publicId) => deleteFileByPublicId(publicId)));
            }

            const updatedService = await CommissionService.findByIdAndUpdate(
                commissionServiceId,
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (oldCategoryId && oldCategoryId.toString() !== updatedService.serviceCategoryId.toString()) {
                const servicesInOldCategory = await CommissionService.find({ serviceCategoryId: oldCategoryId });
                if (servicesInOldCategory.length === 0) {
                    await ServiceCategory.findByIdAndDelete(oldCategoryId);
                }
            }

            return {
                commissionService: updatedService,
            };
        } catch (error) {
            console.log("Error in updating commission service:", error);
            throw new Error("Service update failed");
        }
    };

    static deleteCommissionService = async (talentId, commissionServiceId) => {
        // 1. Check talent and service
        const talent = await User.findById(talentId);
        const service = await CommissionService.findById(commissionServiceId);

        if (!talent) throw new NotFoundError("Talent not found");
        if (!service) throw new NotFoundError("Service not found");
        if (service.talentId.toString() !== talentId)
            throw new BadRequestError("You can only delete your service");

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
            message: "Service and possibly empty category deleted successfully",
        };
    };
}

export default CommissionServiceService;
