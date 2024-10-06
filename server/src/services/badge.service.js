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
        if (!req.file)
            throw new BadRequestError("Please provide a icon!")
    
        try {
            // 3. Compress and upload the image to Cloudinary
            const iconUploadResult = await compressAndUploadImage({
                buffer: req.file.buffer,
                originalname: req.file.originalname,
                folderName: `fiyonce/admin/badges`,
                width: 1920,
                height: 1080
            })
            const icon = iconUploadResult.secure_url
    
            // 4. Parse the criteria field
            let criteriaString = ""
            if (req.body.criteria) {
                try {
                    // Ensure req.body.criteria is a valid JSON object
                    const parsedCriteria = JSON.parse(req.body.criteria)
                    if (typeof parsedCriteria !== 'object' || Array.isArray(parsedCriteria)) {
                        throw new BadRequestError("Invalid criteria format")
                    }
                    // Convert the object to a JSON string
                    criteriaString = JSON.stringify(parsedCriteria)
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
                criteria: criteriaString, // Store the criteria as a JSON string
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
        return {
            badges
        }
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

    static awardEarlyBirdBadge = async (adminId, userId) => {
        // 1. Check admin, user, badge
        const admin = await User.findById(adminId)
        const user = await User.findById(userId)
        const badge = await Badge.findOne({ title: 'earlyBird' })
    
        if (!admin || !user)
            throw new NotFoundError('User not found')
        if (admin.role !== 'admin')
            throw new BadRequestError('Only an admin can perform this action')
        if (!badge)
            throw new NotFoundError('Badge not found')
    
        // 2. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
    
        if (badgeIndex !== -1) 
            throw new BadRequestError('Badge already awarded to this user')
    
        // 3. Award the badge
        const progressMap = new Map()
    
        // Assuming badge.criteria is a string representing JSON object like {"createPost": 1, "createService": 1}
        const criteria = JSON.parse(badge.criteria)
        for (const [criterion, totalCriteria] of Object.entries(criteria)) {
            progressMap.set(criterion, {
                currentProgress: totalCriteria,
                totalCriteria,
                isComplete: false
            })
        }
    
        user.badges.push({
            badgeId: badge._id,
            count: 1,
            progress: progressMap,
            isComplete: true,
            awardedAt: new Date(),
        })
        
        await user.save()
    
        return {
            user
        }
    }    
}

export default BadgeService
