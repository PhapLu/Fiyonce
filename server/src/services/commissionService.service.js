import CommissionService from "../models/commissionService.model.js"
import ServiceCategory from "../models/serviceCategory.model.js"
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
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'

class CommissionServiceService {
    static createCommissionService = async (talentId, req) => {
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (talent.role !== "talent") throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");
        if (!talent?.cccd || !talent?.taxCode) throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này");
    
        const {
            title,
            serviceCategoryId,
            termOfServiceId,
            movementId,
            minPrice,
            deliverables,
            quotation: quotationString, // Extract the serialized quotation string
            status,
        } = req.body;

        console.log(req.body);

        // Parse the quotation from JSON string to an array
        const quotation = JSON.parse(quotationString);
    
        if (!Array.isArray(quotation)) {
            throw new BadRequestError("Quotation must be an array");
        }
    
        quotation.forEach((item, index) => {
            if (typeof item.title !== 'string' || typeof item.price !== 'number') {
                throw new BadRequestError(`Invalid quotation format at index ${index}`);
            }
        });
    
        if (!req.files || !req.files.files) {
            throw new BadRequestError("Hãy cung cấp tranh của bạn");
        }
    
        if (!title || !serviceCategoryId || !minPrice || !deliverables || !termOfServiceId || !movementId) {
            throw new BadRequestError("Hãy nhập đầy đủ những thông tin cần thiết");
        }
    
        // Upload files to Cloudinary (compressed) and get their URLs
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
    
            const artworks = uploadResults.map((result) => result.secure_url);
    
            let service = new CommissionService({
                talentId,
                title,
                serviceCategoryId,
                termOfServiceId,
                movementId,
                minPrice,
                deliverables,
                artworks,
                quotation,  // Parsed array
                status,
            });
    
            await service.save();
    
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
        const service = await CommissionService.findOne({ _id: commissionServiceId, deletedAt: null })
            .populate("talentId", "fullName stageName avatar")
            .populate("termOfServiceId")
            .populate("movementId", "_id title")
            .populate("serviceCategoryId", "_id title")

        if (!service) throw new NotFoundError("Không tìm thấy dịch vụ")

        const token = req.cookies.accessToken

        // Initialize user-related variables
        let talent
        let userId = null

        if (token) {
            // Verify token if it exists
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            userId = payload.id
        }

        // If user is authenticated and not the service owner, increment the views
        if (userId && userId !== service.talentId._id.toString()) {
            console.log('Alo');
            talent = await User.findById(service.talentId._id.toString())
            talent.views += 1
            service.views.push(userId)
            talent.save()
        }

        // Save the service to update views
        await service.save()

        // 3. Read service
        return {
            commissionService: service,
        }
    }

    static readCommissionServices = async (talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (talent.role !== "talent")
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")

        //2. Find services
        const services = await CommissionService.find({
            talentId: talentId,
            deletedAt: null,
        }).populate("talentId", "stageName avatar")

        return {
            commissionServices: services,
        };
    };


    static readBookmarkedServices = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Fetch all bookmarked services
        const bookmarkedServices = await CommissionService.find({ _id: { $in: user.commissionServiceBookmarks }, deletedAt: null })
            .populate('talentId', 'stageName avatar')
            .populate('serviceCategoryId', 'title')
            .populate('movementId', 'title')
            .populate('artworks', 'url')
            .exec()

        return {
            services: bookmarkedServices
        }
    }

    static bookmarkCommissionService = async (userId, commissionServiceId) => {
        // Find user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')

        // Find commissionService
        const commissionService = await CommissionService.findOne({ _id: commissionServiceId, deletedAt: null }).populate('talentId', 'stageName avatar').populate('serviceCategoryId', 'title').populate('movementId', 'title').populate('termOfServiceId', 'title').exec()
        if (!commissionService) throw new NotFoundError('Tác phẩm không tồn tại')

        const userCommissionServiceBookmarkIndex = user.commissionServiceBookmarks.findIndex(commissionServiceBookmark => commissionServiceBookmark.toString() === commissionServiceId)
        const commissionServiceBookmarkIndex = commissionService.bookmarks.findIndex(bookmark => bookmark.user.toString() === userId)

        // Let action to know if the user commissionServiceBookmark/undo their interactions
        let action = "bookmark"

        if (userCommissionServiceBookmarkIndex === -1) {
            user.commissionServiceBookmarks.push(commissionServiceId)
            commissionService.bookmarks.push({ user: new mongoose.Types.ObjectId(userId) })

            // Check if user is commissionService owner
            if (userId !== commissionService.talentId) {
                commissionService.views.concat({ user: new mongoose.Types.ObjectId(userId) })
            }
        } else {
            // Remove commissionServiceBookmark
            user.commissionServiceBookmarks.splice(userCommissionServiceBookmarkIndex, 1)
            commissionService.bookmarks.splice(commissionServiceBookmarkIndex, 1)
            action = "unbookmark"
        }

        await user.save()
        await commissionService.save()

        return {
            commissionService,
            action
        }
    }


    static readBookmarkedServices = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found")

        console.log("PPP")

        //2. Fetch all bookmarked services
        const bookmarkedServices = await CommissionService.find({ _id: { $in: user.commissionServiceBookmarks }, deletedAt: null })
            .populate('talentId', 'stageName avatar')
            .populate('serviceCategoryId', 'title')
            .populate('movementId', 'title')
            .populate('artworks', 'url')
            .exec()

        console.log(bookmarkedServices)

        return {
            services: bookmarkedServices
        }
    }

    static bookmarkCommissionService = async (userId, commissionServiceId) => {
        // Find user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')

        // Find commissionService
        const commissionService = await CommissionService.findOne({ _id: commissionServiceId, deletedAt: null }).populate('talentId', 'stageName avatar').populate('serviceCategoryId', 'title').populate('movementId', 'title').populate('termOfServiceId', 'title').exec()
        if (!commissionService) throw new NotFoundError('Tác phẩm không tồn tại')

        const userCommissionServiceBookmarkIndex = user.commissionServiceBookmarks.findIndex(commissionServiceBookmark => commissionServiceBookmark.toString() === commissionServiceId)
        const commissionServiceBookmarkIndex = commissionService.bookmarks.findIndex(bookmark => bookmark.user.toString() === userId)

        // Let action to know if the user commissionServiceBookmark/undo their interactions
        let action = "bookmark"

        if (userCommissionServiceBookmarkIndex === -1) {
            user.commissionServiceBookmarks.push(commissionServiceId)
            commissionService.bookmarks.push({ user: new mongoose.Types.ObjectId(userId) })

            // Check if user is commissionService owner
            if (userId !== commissionService.talentId) {
                commissionService.views.concat({ user: new mongoose.Types.ObjectId(userId) })
            }
        } else {
            // Remove commissionServiceBookmark
            user.commissionServiceBookmarks.splice(userCommissionServiceBookmarkIndex, 1)
            commissionService.bookmarks.splice(commissionServiceBookmarkIndex, 1)
            action = "unbookmark"
        }

        await user.save()
        await commissionService.save()

        return {
            commissionService,
            action
        }
    }

    static updateCommissionService = async (talentId, commissionServiceId, req) => {
        const talent = await User.findById(talentId)
        const service = await CommissionService.findOne({ _id: commissionServiceId, deletedAt: null })

        if (!talent) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')
        if (!service) throw new NotFoundError('Không tìm thấy dịch vụ')
        if (!service.movementId) throw new NotFoundError('Không tìm thấy trường phái')
        if (service.talentId.toString() !== talentId) throw new BadRequestError('Bạn không có quyền thực hiện thao tác này')
        if (!talent?.cccd || !talent?.taxCode)
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này")
        const oldCategoryId = service.serviceCategoryId

        try {
            const updates = { ...req.body }

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
                )
                const uploadResults = await Promise.all(uploadPromises)
                const artworks = uploadResults.map((result) => result.secure_url)
                updates.artworks = artworks

                // Delete old files from Cloudinary
                const publicIds = service.artworks.map((artwork) =>
                    extractPublicIdFromUrl(artwork)
                )
                await Promise.all(publicIds.map((publicId) => deleteFileByPublicId(publicId)))
            }

            const updatedService = await CommissionService.findOneAndUpdate(
                {
                    $and: [
                        { _id: commissionServiceId }, // Match the service ID
                        { deletedAt: null } // Ensure the service is not deleted
                    ]
                },
                { $set: updates },
                { new: true, runValidators: true }
            )


            if (oldCategoryId && oldCategoryId.toString() !== updatedService.serviceCategoryId.toString()) {
                const servicesInOldCategory = await CommissionService.find({ serviceCategoryId: oldCategoryId, deletedAt: null })
                if (servicesInOldCategory.length === 0) {
                    await ServiceCategory.findByIdAndDelete(oldCategoryId)
                }
            }

            return {
                commissionService: updatedService,
            }
        } catch (error) {
            console.log("Error in updating commission service:", error)
            throw new Error("Service update failed")
        }
    }

    static deleteCommissionService = async (talentId, commissionServiceId) => {
        // 1. Check talent and service
        const talent = await User.findById(talentId)
        const service = await CommissionService.findOne({ _id: commissionServiceId, deletedAt: null })
        console.log("abc")
        console.log(service)

        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!service) throw new NotFoundError("Không tìm thấy dịch vụ")
        if (service.talentId.toString() !== talentId)
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")
        if (!talent?.cccd || !talent?.taxCode)
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này")

        // 2. Extract public IDs and delete files from Cloudinary
        // const publicIds = service.artworks.map((artwork) =>
        //     extractPublicIdFromUrl(artwork)
        // )
        // await Promise.all(
        //     publicIds.map((publicId) => deleteFileByPublicId(publicId))
        // )

        // 4. Delete the service from the database
        const serviceCategoryId = service.serviceCategoryId

        service.deletedAt = new Date();
        console.log("Setting deletedAt:", service.deletedAt);
        // await service.deleteOne()
        await service.save();
        console.log(service)

        // 5. Check if the category has other services
        const remainingServices = await CommissionService.find({
            serviceCategoryId,
            deletedAt: null,
        })

        const ct = await ServiceCategory.findById(serviceCategoryId);

        console.log(remainingServices)
        console.log(ct)

        if (remainingServices.length === 0) {
            await ServiceCategory.findByIdAndUpdate(
                serviceCategoryId, // Pass the serviceCategoryId directly
                { $set: { deletedAt: new Date() } } // Use $set to update the deletedAt field
            );
        }

        return {
            message: "Xóa dịch vụ thành công",
        }
    }

    static bookmarkCommissionService = async (userId, commissionServiceId) => {
        // Find user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')

        // Find commissionService
        const commissionService = await CommissionService.findOne({ _id: commissionServiceId, deletedAt: null }).populate('talentId', 'stageName avatar').populate('serviceCategoryId', 'title').populate('movementId', 'title').populate('termOfServiceId', 'title').exec()
        if (!commissionService) throw new NotFoundError('Tác phẩm không tồn tại')

        const userCommissionServiceBookmarkIndex = user.commissionServiceBookmarks.findIndex(commissionServiceBookmark => commissionServiceBookmark.toString() === commissionServiceId)
        const commissionServiceBookmarkIndex = commissionService.bookmarks.findIndex(bookmark => bookmark.user.toString() === userId)

        // Let action to know if the user commissionServiceBookmark/undo their interactions
        let action = "bookmark"

        if (userCommissionServiceBookmarkIndex === -1) {
            user.commissionServiceBookmarks.push(commissionServiceId)
            commissionService.bookmarks.push({ user: new mongoose.Types.ObjectId(userId) })

            // Check if user is commissionService owner
            if (userId !== commissionService.talentId) {
                commissionService.views.concat({ user: new mongoose.Types.ObjectId(userId) })
            }
        } else {
            // Remove commissionServiceBookmark
            user.commissionServiceBookmarks.splice(userCommissionServiceBookmarkIndex, 1)
            commissionService.bookmarks.splice(commissionServiceBookmarkIndex, 1)
            action = "unbookmark"
        }

        await user.save()
        await commissionService.save()

        return {
            commissionService,
            action
        }
    }
}

export default CommissionServiceService
