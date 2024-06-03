import cloudinary from '../configs/cloudinary..config.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import sendEmail from '../middlewares/sendMail.js'
import { artwork } from '../models/artwork.model.js'
import TalentRequest from '../models/talentRequest.model.js'
import {User} from '../models/user.model.js'
import crypto from 'crypto'

class UserService{
//-------------------CRUD----------------------------------------------------
    static updateProfile = async(userId, body) => {
        //1. Check user
        const currentUser = await User.findById(body._id)
        if(userId != currentUser._id.toString()) throw new AuthFailureError('You can only update your account')
        //2. Update user
        const updatedUser = await User.findByIdAndUpdate(
            body._id,
            { $set: body},
            { new: true }   
        )
        return {
            updatedUser
        }
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
        // 1. Check user exists and is not a talent
        const currentUser = await User.findById(userId);
        if (!currentUser) throw new NotFoundError('User not found');
        if (currentUser.role === 'talent') throw new BadRequestError('User already a talent');

        // 2. Validate request body
        const { stageName, portfolioLink, phone } = req.body;
        const requests = await TalentRequest.find()
        if (!req.files || !req.files.artworks) {
            throw new BadRequestError('Please provide artwork files');
        }
        if (!userId || !stageName || !portfolioLink || !phone) {
            throw new BadRequestError('Please provide all required fields');
        }
        for (let request of requests){
            if(request.phone === phone) throw new BadRequestError('Phone number already used')
        }
        // 3. Upload files to Cloudinary and get their URLs
        const uploadToCloudinary = (file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        public_id: `${Date.now()}-${file.originalname}`,
                        folder: `fiyonce/talentRequests/${userId}`
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                );
                uploadStream.end(file.buffer);
            });
        };

        const uploadPromises = req.files.artworks.map(uploadToCloudinary);
        const artworks = await Promise.all(uploadPromises);

        // 4. Create and save talent request
        const talentRequest = new TalentRequest({
            userId,
            stageName,
            portfolioLink,
            phone,
            artworks
        });
        await talentRequest.save();
    
        return {
            talentRequest
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
        
        // 4. Create AccessToken and RefreshToken and save
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        //5. Exclude password from foundUser
        const { password: hiddenPassword, ...userWithoutPassword } = updatedUser;
        // 6. Generate tokens
        const tokens = await createTokenPair(
            userWithoutPassword,
            publicKey,
            privateKey
        );
        
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        });

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
