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
import { checkAmbassadorAchievable, checkEarlyBirdAchievable, checkTrustedArtistAchievable } from "../models/repositories/badge.repo.js"

class BadgeService {
    static createBadge = async (adminId, req) => {
        console.log(req.body);
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
                displayTitle: req.body.displayTitle
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

    static readEarlyBirdBadge = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found!")

        //2. Find the badge
        const badge = await Badge.findOne({ title: 'earlyBird' })
        if (!badge) throw new NotFoundError("Badge not found!")

        //3. Check if badge is achieved
        const achievable = await checkEarlyBirdAchievable(user)
        
        //4. Check if badge is already awarded (if it awarded -> claimable = false, if not -> claimable = true)
        const badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
        const claimable = badgeIndex !== -1

        return {
            badge,
            achievable,
            claimable
        }
    }

    static readTrustedArtistBadge = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("User not found!")

        //2. Find the badge
        const badge = await Badge.findOne({ title: 'trustedArtist' })
        if(!badge) throw new NotFoundError("Badge not found!")

        //3. Check if badge is achieved
        const achievable = await checkTrustedArtistAchievable(user)

        //4. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
        const claimable = badgeIndex !== -1

        return {
            badge,
            achievable,
            claimable
        }
    }

    static readPlatformAmbassadorBadge = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("User not found!")

        //2. Find the badge
        const badge = await Badge.findOne({ title: 'platformAmbassador' })
        if(!badge) throw new NotFoundError("Badge not found!")

        //3. Check if badge is achieved
        const achievable = await checkAmbassadorAchievable(user)

        //4. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
        const claimable = badgeIndex !== -1

        return {
            badge,
            achievable,
            claimable
        }
    }

    static updateBadge = async (adminId, badgeId, req) => {
        // 1. Check admin and badge
        const admin = await User.findById(adminId);
        const badge = await Badge.findById(badgeId);
        if (!admin) throw new NotFoundError("Admin not found!");
        if (!badge) throw new NotFoundError("Badge not found!");
        if (admin.role !== "admin") throw new AuthFailureError("You are not an admin!");
    
        try {
            const iconToDelete = badge.icon;
            let iconUpdated;
    
            if (req.file) {
                // 3. Compress and upload the image to Cloudinary
                const iconUploadResult = await compressAndUploadImage({
                    buffer: req.file.buffer,
                    originalname: req.file.originalname,
                    folderName: `fiyonce/badges/admin`,
                    width: 1920,
                    height: 1080
                });
                iconUpdated = iconUploadResult.secure_url;
    
                // 4. Delete the old icon in Cloudinary
                if (iconUpdated) {
                    const publicId = extractPublicIdFromUrl(iconToDelete);
                    await deleteFileByPublicId(publicId);
                }
            }
    
            // 5. Prepare the update data
            const updateData = { ...req.body };
            if (iconUpdated) {
                updateData.icon = iconUpdated;
            }
    
            // 6. Update the badge
            const updatedBadge = await Badge.findByIdAndUpdate(
                badgeId,
                updateData,
                { new: true }
            );
    
            return {
                badge: updatedBadge
            };
        } catch (error) {
            console.error(`Error uploading or saving data ${error}`);
            throw new BadRequestError("Error updating badge!");
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

    static awardEarlyBirdBadge = async (userId) => {
        //1. Check user, badge
        const user = await User.findById(userId)
        const badge = await Badge.findOne({ title: 'earlyBird' })
        if(!user) throw new NotFoundError("User not found!")
        if(!badge) throw new NotFoundError("Badge not found!")

        //2. Check if user is achievable
        const achievable = await checkEarlyBirdAchievable(user)
        if(!achievable) throw new BadRequestError("User is not eligible for this badge!")

        //3. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
        if(badgeIndex !== -1) throw new BadRequestError("User already has this badge!")

        //4. Award the badge
        user.badges.push(badge._id.toString())
        await user.save()

        return {
            message: "Badge awarded successfully!"
        }
    }    

    static awardTrustedArtistBadge = async (userId) => {
        //1. Check user, badge
        const user = await User.findById(userId)
        const badge = await Badge.findOne({ title: 'trustedArtist' })
        if(!user) throw new NotFoundError("User not found!")
        if(!badge) throw new NotFoundError("Badge not found!")

        //2. Check if user is achievable
        const achievable = await checkTrustedArtistAchievable(user)
        if(!achievable) throw new BadRequestError("User is not eligible for this badge!")

        //3. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
        if(badgeIndex !== -1) throw new BadRequestError("User already has this badge!")

        //4. Award the badge
        user.badges.push(badge._id.toString())
        await user.save()

        return {
            message: "Badge awarded successfully!"
        }
    }

    static awardPlatformAmbassadorBadge = async (userId) => {
        //1. Check user, badge
        const user = await User.findById(userId)
        const badge = await Badge.findOne({ title: 'platformAmbassador' })
        if(!user) throw new NotFoundError("User not found!")
        if(!badge) throw new NotFoundError("Badge not found!")

        //2. Check if user is achievable
        const achievable = await checkAmbassadorAchievable(user)
        if(!achievable) throw new BadRequestError("User is not eligible for this badge!")

        //3. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(b => b.badgeId.toString() === badge._id.toString())
        if(badgeIndex !== -1) throw new BadRequestError("User already has this badge!")

        //4. Award the badge
        user.badges.push(badge._id.toString())
        await user.save()

        return {
            message: "Badge awarded successfully!"
        }
    }
}

export default BadgeService
