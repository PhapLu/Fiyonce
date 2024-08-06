import Badge from "../models/badge.model.js"
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

class BadgeService {
    static createBadge = async (adminId, req) => {
        // 1. Check if the user is an admin
        const admin = await User.findById(adminId)
        if (!admin) throw new NotFoundError("Admin not found!")
        if (admin.role !== "admin") throw new AuthFailureError("You are not an admin!")
    
        // 2. Validate request body
        const { title, description } = req.body
        if (!title || !description) throw new BadRequestError("Missing required fields!")
        if (req.files && !req.files.thumbnail)
            throw new BadRequestError("Please provide a thumbnail!")
    
        try {
            // 3. Compress and upload the image to Cloudinary
            const thumbnailUploadResult = await compressAndUploadImage({
                buffer: req.files.thumbnail[0].buffer,
                originalname: req.files.thumbnail[0].originalname,
                folderName: `fiyonce/admin/badges`,
                width: 1920,
                height: 1080
            })
            const icon = thumbnailUploadResult.secure_url
    
            // 4. Parse the criteria field
            let parsedCriteria
            if (req.body.criteria) {
                try {
                    parsedCriteria = JSON.parse(req.body.criteria)
                } catch (parseError) {
                    console.error("Criteria parsing error:", parseError)
                    throw new BadRequestError("Invalid criteria format")
                }
            }
    
            // 5. Create the badge
            const badge = new Badge({
                icon,
                title,
                description,
                criteria: parsedCriteria, // explicitly assign the parsed criteria
                level: req.body.level,
                type: req.body.type,
            })
    
            await badge.save()
    
            return {
                badge
            }
        } catch (error) {
            console.error(`Error uploading or saving data ${error}`)
            throw new BadRequestError("Error creating badge!")
        }
    }    

    static readBadges = async () => {
        const badges = await Badge.find()
        return badges
    }

    static readBadge = async(badgeId) => {
        //1. Check if the badge exists
        const badge = await Badge.findById(badgeId)
        if(!badge) throw new NotFoundError("Badge not found!")
        
        return {
            badge
        }
    }

    static updateBadge = async (adminId, badgeId, req) => {
        //1. Check admin and badge
        const admin = await User.findById(adminId)
        const badge = await Badge.findById(badgeId)
        if(!admin) throw new NotFoundError("Admin not found!")
        if(!badge) throw new NotFoundError("Badge not found!")
        if(admin.role !== "admin") throw new AuthFailureError("You are not an admin!")

        try {
            const iconToDelete = badge.icon
            let iconUpdated

            if(req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
                //3. Compress and upload the image to Cloudinary
                const thumbnailUploadResult = await compressAndUploadImage({
                    buffer: req.files.thumbnail[0].buffer,
                    originalname: req.files.thumbnail[0].originalname,
                    folderName: `fiyonce/badges/admin`,
                    width: 1920,
                    height: 1080
                })
                iconUpdated = thumbnailUploadResult.secure_url
                
                //4. Delete the old icon in Cloudinary
                if(iconUpdated) {
                    const publicId = extractPublicIdFromUrl(iconToDelete)
                    await deleteFileByPublicId(publicId)
                }
            }

            //5. Update the badge
            const updatedBadge = await Badge.findByIdAndUpdate(
                badgeId,
                {
                    icon: iconUpdated,
                    ...req.body
                },
                { new: true }
            )
    
            return {
                badge: updatedBadge
            }
        } catch (error) {
            console.error(`Error uploading or saving data ${error}`)
            throw new BadRequestError("Error updating badge!")
        }
    }

    static deleteBadge = async (adminId, badgeId) => {
        //1. Check user and badge
        const admin = await User.findById(adminId)
        const badge = await Badge.findById(badgeId)
        if(!admin) throw new NotFoundError("Admin not found!")
        if(!badge) throw new NotFoundError("Badge not found!")
        if(admin.role !== "admin") throw new AuthFailureError("You are not an admin!")

        //2. Delete the badge
        const iconToDelete = badge.icon
        await badge.deleteOne()
        
        //3. Delete the badge icon in Cloudinary
        const publicId = extractPublicIdFromUrl(iconToDelete)
        await deleteFileByPublicId(publicId)

        return {
            message: "Badge deleted successfully!"
        }
    }
}

export default BadgeService
