import Submission from "../models/submission.model.js"
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
import brevoSendEmail from "../configs/brevo.email.config.js"
import Challenge from "../models/challenge.model.js"

class SubmissionService {
    static createSubmission = async (userId, challengeId, req) => {
        //1. Check user and challenge
        const user = await User.findById(userId)
        const challenge = await Challenge.findById(challengeId)
        if (!user) throw new NotFoundError("User not found")
        if (!challenge) throw new NotFoundError("Challenge not found")

        //2. Validate request body
        if (!req.body.title || !req.files.artworks || req.files.artworks.length == 0)
            throw new BadRequestError("Please provide required fields")
        if(req.body.votes) throw new BadRequestError("This field is not allowed")

        //3. Upload artwork to cloudinary
        const artworkUploadResult = await compressAndUploadImage({
            buffer: req.files.artworks[0].buffer,
            originalname: req.files.artworks[0].originalname,
            folderName: `fiyonce/user/submissions`,
            width: 1920,
            height: 1080,
        })
        const artwork = artworkUploadResult.secure_url

        //4. Create submission
        const submission = new Submission({
            challengeId,
            userId,
            artwork,
            ...req.body,
        })
        await submission.save()

        return {
            submission
        }
    }

    static updateSubmission = async (userId, submissionId, req) => {
        //1. Check user and submission
        const user = await User.findById(userId)
        const submission = await Submission.findById(submissionId)
        if (!user) throw new NotFoundError("User not found")
        if(!submission) throw new NotFoundError("Submission not found")
        if(submission.userId.toString() !== userId) throw new AuthFailureError("You are not authorized")

        //2. Validate request body
        if(req.body.votes) throw new BadRequestError("This field is not allowed")

        //3. Upload artwork to cloudinary
        const submissionToDelete = submission.artwork
        let submissionUpdated
        if(req.files && req.files.artworks && req.files.artworks.length > 0){
            const artworkUploadResult = await compressAndUploadImage({
                buffer: req.files.artworks[0].buffer,
                originalname: req.files.artworks[0].originalname,
                folderName: `fiyonce/user/submissions`,
                width: 1920,
                height: 1080,
            })
            submissionUpdated = artworkUploadResult.secure_url
            
            //4. Delete old artwork
            const publicId = extractPublicIdFromUrl(submissionToDelete)
            await deleteFileByPublicId(publicId)
        }

        //5. Update submission
        const updatedSubmission = await Submission.findByIdAndUpdate(
            submissionId,
            {
                title: req.body.title || submission.title,
                artwork: submissionUpdated || submission.artwork,
                description: req.body.description || submission.description,
            },
            { new: true }
        )

        return {
            submission: updatedSubmission
        }
    }

    static voteSubmission = async (userId, submissionId) => {
        //1. Check user and submission
        const user = await User.findById(userId)
        const submission = await Submission.findById(submissionId)
        if(!user) throw new NotFoundError("User not found")
        if(!submission) throw new NotFoundError("Submission not found")

        //2. Check if user has already voted
        if(submission.votes.includes(userId)) 
            throw new BadRequestError("You have already voted")

        //3. Vote submission
        submission.votes.push(userId)
        await submission.save()

        return {
            submission
        }
    }

    static readSubmissions = async () => {
        //1. Get all submissions
        const submissions = await Submission.find()

        return {
            submissions
        }
    }

    static readSubmission = async (submissionId) => {
        //1. Check submission
        const submission = await Submission.findById(submissionId)
        if(!submission) throw new NotFoundError("Submission not found")

        return {
            submission
        }
    }
}

export default SubmissionService
