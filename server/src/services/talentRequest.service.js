import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import TalentRequest from '../models/talentRequest.model.js'
import { User } from '../models/user.model.js'
import sendEmail from '../middlewares/sendMail.js'
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from '../utils/cloud.util.js'

class TalentRequestService{
    static requestUpgradingToTalent = async (userId, req) => {
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
            //Extract the artwork public_id by using cloud util function
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
            talentRequest: newTalentRequest
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
        //4. Exclude password from user object
        const { password: hiddenPassword, ...userWithoutPassword } = updatedUser;

        //5. Mark request as approved
        request.status = 'approved'
        await request.save()

        //6. Send email to user
        sendEmail(foundUser.email, 'Role Updated', 'Your role has been updated to talent')
        
        return {
            user: userWithoutPassword._doc
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

export default TalentRequestService
