import Movement from "../models/movement.model.js"
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

class MovementService {
    static createMovement = async (adminId, req) => {
        //1. Check if admin exists
        const admin = await User.findById(adminId)
        if (!admin) throw new AuthFailureError("Admin not found")
        if(admin.role !== "admin") throw new AuthFailureError("Unauthorized")

        //2. Validate request body
        if (!req.body.title) throw new BadRequestError("Please provide title")
        if (req.files && !req.files.thumbnail)
            throw new BadRequestError("Please provide thumbnail")

        //3.Upload thumbnail to cloudinary
        const thumbnailUploadResult = await compressAndUploadImage({
            buffer: req.files.thumbnail[0].buffer,
            originalname: req.files.thumbnail[0].originalname,
            folderName: `fiyonce/admin/movements`,
            width: 1920,
            height: 1080,
        })
        const thumbnail = thumbnailUploadResult.secure_url

        //4. Create movement
        const movement = new Movement({
            title: req.body.title,
            thumbnail,
        })

        await movement.save()
        return {
            movement,
        }
    }

    static readMovements = async () => {
        const movements = await Movement.aggregate([
            {
                $lookup: {
                    from: "Posts",
                    localField: "_id",
                    foreignField: "movementId",
                    as: "posts",
                },
            },
            {
                $lookup: {
                    from: "CommissionServices", // Assuming the collection name is 'CommissionServices'
                    localField: "_id",
                    foreignField: "movementId", // Assuming the field name in CommissionServices is 'movements'
                    as: "commissionServices",
                },
            },
            {
                $addFields: {
                    postCount: { $size: "$posts" },
                    commissionServiceCount: { $size: "$commissionServices" },
                },
            },
            {
                $project: {
                    posts: 0, // Exclude the artworks array to reduce payload size
                    commissionServices: 0, // Exclude the commissionServices array to reduce payload size
                },
            },
        ])
        return {
            movements,
        }
    }

    static updateMovement = async (adminId, movementId, req) => {
        // 1. Check if admin and movement exist
        const admin = await User.findById(adminId)
        const movement = await Movement.findById(movementId)
        if (!admin) throw new NotFoundError("Admin not found")
        if (!movement) throw new NotFoundError("Movement not found")
        if (admin.role !== "admin") throw new AuthFailureError("Unauthorized")

        // 2. Handle thumbnail upload
        try {
            const thumbnailToDelete = movement.thumbnail
            let thumbnailUpdated

            if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
                const thumbnailUploadResult = await compressAndUploadImage({
                    buffer: req.files.thumbnail[0].buffer,
                    originalname: req.files.thumbnail[0].originalname,
                    folderName: `fiyonce/admin/movements`,
                    width: 1920,
                    height: 1080,
                })
                thumbnailUpdated = thumbnailUploadResult.secure_url

                // 3. Delete old thumbnail from cloudinary if a new one is uploaded
                if (thumbnailUploadResult) {
                    const publicId = extractPublicIdFromUrl(thumbnailToDelete)
                    await deleteFileByPublicId(publicId)
                }
            }

            // 4. Merge existing movement fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = { ...movement.toObject(), ...req.body }

            // Ensure the thumbnail is only updated if a new value is provided
            updatedFields.thumbnail = thumbnailUpdated

            // 5. Update movement
            const updatedMovement = await Movement.findByIdAndUpdate(
                movementId,
                updatedFields,
                { new: true }
            )

            return {
                movement: updatedMovement,
            }
        } catch (error) {
            console.error("Error in updating movement:", error)
            throw new Error("Movement update failed")
        }
    }

    static deleteMovement = async (adminId, movementId) => {
        //1. Check if admin and movement exists
        const admin = await User.findById(adminId)
        const movement = await Movement.findById(movementId)
        if (!admin) throw new AuthFailureError("Admin not found")
        if (!movement) throw new BadRequestError("Movement not found")
        if(admin.role !== "admin") throw new AuthFailureError("Unauthorized")

        //2. Delete movement
        const thumbnailToDelete = movement.thumbnail
        await movement.deleteOne()

        //3. Delete movement thumbnail from cloudinary
        const publicId = extractPublicIdFromUrl(thumbnailToDelete)
        await deleteFileByPublicId(publicId)

        return {
            message: "Movement deleted",
        }
    }
}

export default MovementService
