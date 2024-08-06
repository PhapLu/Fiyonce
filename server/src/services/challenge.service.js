import Challenge from "../models/challenge.model.js"
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

class ChallengeService {
    static createChallenge = async (adminId, req) => {
        //1. Check admin
        const admin = await User.findById(adminId)
        if (!admin) throw new NotFoundError("Admin not found")
        if(admin.role !== 'admin') throw new AuthFailureError("Admin not found")

        //2. Validate request body
        if (!req.body.title || !req.body.description) 
            throw new BadRequestError("Please provide required fields")

        //3. Upload thumbnail to cloudinary
        const thumbnailUploadResult = await compressAndUploadImage({
            buffer: req.files.thumbnail[0].buffer,
            originalname: req.files.thumbnail[0].originalname,
            folderName: `fiyonce/admin/challenges`,
            width: 1920,
            height: 1080,
        })
        const thumbnail = thumbnailUploadResult.secure_url

        //4. Create challenge
        const challenge = new Challenge({
            thumbnail,
            ...req.body
        })
        await challenge.save()

        return {
            challenge
        }
    }

    static readChallenges = async () => {
        const challenges = await Challenge.find()
        return {
            challenges
        }
    }

    static readChallenge = async (challengeId) => {
        //1. Check challenge
        const challenge = await Challenge.findById(challengeId)
        if(!challenge) throw new NotFoundError("Challenge not found")

        return {
            challenge
        }
    }

    static updateChallenge = async (adminId, challengeId, req) => {
        //1. Check admin and challenge
        const admin = await User.findById(adminId)
        const challenge = await Challenge.findById(challengeId)
        if (!admin) throw new NotFoundError("Admin not found")
        if(!challenge) throw new NotFoundError("Challenge not found")
        if(admin.role !== 'admin') throw new AuthFailureError("Admin not found")

        //2. Validate request body
        if (!req.body.title || !req.body.description) 
            throw new BadRequestError("Please provide required fields")

        //3. Upload thumbnail to cloudinary
        const thumbnailToDelete = challenge.thumbnail
        let thumbnailUpdated
        try {
            if(req.files && req.files.thumbnail && req.files.thumbnail.length > 0){
                const thumbnailUploadResult = await compressAndUploadImage({
                    buffer: req.files.thumbnail[0].buffer,
                    originalname: req.files.thumbnail[0].originalname,
                    folderName: `fiyonce/admin/challenges`,
                    width: 1920,
                    height: 1080,
                })
                thumbnailUpdated = thumbnailUploadResult.secure_url

                //4. Delete old thumbnail
                const publicId = extractPublicIdFromUrl(thumbnailToDelete)
                await deleteFileByPublicId(publicId)

                //5. Update challenge
                const updatedChallenge = await Challenge.findByIdAndUpdate(
                    challengeId,
                    {
                        thumbnail: thumbnailUpdated,
                        ...req.body
                    },
                    { new: true }
                )
                return {
                    challenge: updatedChallenge
                }
            }
        } catch (error) {
            console.error(`Error updating thumbnail: ${error}`)
            throw new BadRequestError("Error updating thumbnail")
        }
    }

    static deleteChallenge = async (adminId, challengeId) => {
        //1. Check admin and challenge
        const admin = await User.findById(adminId)
        const challenge = await Challenge.findById(challengeId)
        if (!admin) throw new NotFoundError("Admin not found")
        if (!challenge) throw new NotFoundError("Challenge not found")
        if (admin.role !== 'admin') throw new AuthFailureError("Unauthorized")

        //2. Delete challenge
        const thumbnailToDelete = challenge.thumbnail
        try {
            await challenge.deleteOne()
        } catch (error) {
            console.error(`Error deleting challenge: ${error}`)
        }

        //3. Delete thumbnail
        const publicId = extractPublicIdFromUrl(thumbnailToDelete)
        await deleteFileByPublicId(publicId)

        return {
            message: "Challenge deleted successfully"
        }
    }
}

export default ChallengeService
