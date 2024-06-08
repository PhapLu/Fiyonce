import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import TalentRequest from '../models/talentRequest.model.js'
import { artwork } from '../models/artwork.model.js'
import { User } from '../models/user.model.js'
import sendEmail from '../middlewares/sendMail.js'
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from '../utils/cloud.util.js'
import jwt from 'jsonwebtoken'

class UserService{
//-------------------CRUD----------------------------------------------------
    static updateProfile = async(userId, profileId, body) => {
        //1. Check user
        const profile = await User.findById(profileId)
        if(!profile) throw new NotFoundError('User not found')
        if(profileId != userId) throw new AuthFailureError('You can only update your account')
        //2. Update user
        const updatedUser = await User.findByIdAndUpdate(
            profileId,
            { $set: body},
            { new: true }   
        )
        return {
            updatedUser
        }
    }
    
    static me = async(accessToken) => {
        //1. Decode accessToken
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        if(!decoded) throw new AuthFailureError('Invalid token')
        const userId = decoded.id
        if(!userId) throw new AuthFailureError('Invalid validation')
        const user = await User.findById(userId).select('-password')
        if(!user) throw new NotFoundError('User not found')

        return {user}

    }

    static readUserProfile = async(profileId) => {
        //1. Check user
        const userProfile = await User.findById(profileId)
        if(!userProfile) throw new NotFoundError('User not found')
        //2. Return user profile
        return{
            userProfile
        }
    }

    static deleteProfile = async(userId, profileId) => {
        //1. Check user and profile
        const userProfile = await User.findById(profileId)
        if(!userProfile) throw new NotFoundError('User not found')
        if(userId.toString() != profileId) throw new AuthFailureError('You can only delete your account')
        //2. Delete profile
        await User.findByIdAndDelete(profileId)
        return { success: true, message: 'User deleted successfully' };
    }
//-------------------END CRUD----------------------------------------------------
    static addToBookmark = async(userId, artworkId) => {
        //1.
        const currentUser = await User.findById(userId)
        if(!currentUser) throw new NotFoundError('User not found')
        if(currentUser.bookmark.includes(artworkId)) throw new BadRequestError('Artwork already bookmarked')
        //2.
        currentUser.bookmark.push(artworkId)
        await currentUser.save()
        return {
            currentUser
        }
    }

    static likeArtwork = async(userId, artworkId) => {
        //1.
        const currentUser = await User.findById(userId)
        const foundArtwork = await artwork.findById(artworkId)
        if(!currentUser) throw new NotFoundError('User not found')
        if(!foundArtwork) throw new NotFoundError('Artwork not found')
        if(foundArtwork.artwork_likes.includes(currentUser._id.toString()))
            throw new BadRequestError('You did like this artwork') 
        //2.
        foundArtwork.artwork_likes.push(userId)
        foundArtwork.save()
        return foundArtwork
    }

    static requestUpgradingToTalent = async (userId, req) => {
        console.log(req.files)
        // 1. Check user exists and is not a talent
        const currentUser = await User.findById(userId);
        if (!currentUser) throw new NotFoundError('User not found');
        if (currentUser.role === 'talent') throw new BadRequestError('User already a talent');

        // 2. Validate request body
        const { stageName, portfolioLink } = req.body;
        if (!req.files || !req.files.files) {
            throw new BadRequestError('Please provide artwork files');
        }
        if (!userId || !stageName || !portfolioLink) {
            throw new BadRequestError('Please provide all required fields');
        }

        //3. Check if user has requested before
        const talentRequest = await TalentRequest.findOne({userId})
        if(talentRequest){
            //Extract the artwork public_id by using util function
            const publicIds = talentRequest.artworks.map(artwork => extractPublicIdFromUrl(artwork))
            //Delete the files from Cloudinary
            await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)))
            //Delete the request from database
            await TalentRequest.deleteOne({userId})
        }

        // 4. Upload files to Cloudinary(compressed) and get their URLs
        const uploadPromises = req.files.files.map(file => compressAndUploadImage({
            buffer: file.buffer,
            originalname: file.originalname,
            folderName: `fiyonce/talentRequests/${userId}`
          }));
        const uploadResults = await Promise.all(uploadPromises);
        const artworkUrls = uploadResults.map(result => result.secure_url);

        // 5. Create and save talent request
        const newTalentRequest = new TalentRequest({
            userId,
            stageName,
            portfolioLink,
            artworks: artworkUrls
        });
        await newTalentRequest.save();
    
        return {
            newTalentRequest
        };
    }

//------------------Admin----------------------------------------------------------
    static upgradeRoleToTalent = async(adminId, requestId) => {
        //1. Find and check request
        const request = await TalentRequest.findById(requestId)
        if(!request) throw new NotFoundError('Request not found')
        if(request.status === 'approved') throw new BadRequestError('Request already approved')

        //2. Find and check admin, user and user role
        const userId = request.userId;
        const adminUser = await User.findById(adminId)
        const foundUser = await User.findById(userId)

        if(!adminUser || adminUser.role !== 'admin') throw new AuthFailureError('You do not have enough permission')
        if(!foundUser) throw new NotFoundError('User not found')
        if(foundUser.role === 'talent') throw new BadRequestError('User already a talent')

        //3. update role to talent
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: {role: 'talent'} },
            { new: true }
        )
        
        const { password: hiddenPassword, ...userWithoutPassword } = updatedUser;

        //4. Mark request as approved
        request.status = 'approved'
        await request.save()

        //5. Send email to user
        sendEmail(foundUser.email, 'Role Updated', 'Your role has been updated to talent')
        return {
            updatedUser
        }
    }

    static denyTalentRequest = async(adminId, requestId) => {
        //1. Find and check request
        const request = await TalentRequest.findById(requestId)
        if(!request) throw new NotFoundError('Request not found')
        if(request.status === 'rejected') throw new BadRequestError('Request already denied')

        //2. Find and check admin, user and user role
        const userId = request.userId;
        const adminUser = await User.findById(adminId)
        const foundUser = await User.findById(userId)

        if(!adminUser || adminUser.role !== 'admin') throw new AuthFailureError('You do not have enough permission')
        if(!foundUser) throw new NotFoundError('User not found')
        if(foundUser.role === 'talent') throw new BadRequestError('User already a talent')
        
        //3. Mark request as denied
        request.status = 'rejected'
        await request.save()

        //4. Send email to user
        sendEmail(foundUser.email, 'Request Denied', 'Your request has been rejected')
        return {
            success: true,
            message: 'Request denied successfully'
        }
    }

    static viewTalentRequests = async(adminId) => {
        //1. Check admin account
        const adminUser = await User.findById(adminId)
        if(!adminUser) throw new NotFoundError('User not found')
        if(!adminUser || adminUser.role !== 'admin') throw new AuthFailureError('You do not have enough permission')

        //2. Find all talent requests
        const talentRequests = await TalentRequest.find()
        return {
            talentRequests
        }
    }

    static viewTalentRequest = async(adminId, requestId) => {
        //1. Check admin account
        const adminUser = await User.findById(adminId)
        if(!adminUser) throw new NotFoundError('User not found')
        if(!adminUser || adminUser.role !== 'admin') throw new AuthFailureError('You do not have enough permission')

        //2. Find talent request by id
        const talentRequest = await TalentRequest.findById(requestId)
        if(!talentRequest) throw new NotFoundError('Talent request not found')
        return {
            talentRequest
        }
    }

}

export default UserService
