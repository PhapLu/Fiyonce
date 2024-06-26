import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import Artwork from '../models/artwork.model.js'
import { User } from '../models/user.model.js'
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
            user: updatedUser
        }
    }

    static readUserProfile = async(profileId) => {
        //1. Check user
        const userProfile = await User.findById(profileId)
        if(!userProfile) throw new NotFoundError('User not found')

        //2. Return user profile
        return{
            user: userProfile
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
        //1. Check user and artwork
        const currentUser = await User.findById(userId)
        if(!currentUser) throw new NotFoundError('User not found')
        if(currentUser.bookmark.includes(artworkId)) throw new BadRequestError('Artwork already bookmarked')

        //2. Add to bookmark
        currentUser.bookmark.push(artworkId)
        await currentUser.save()
        return {
            user: currentUser
        }
    }

    static likeArtwork = async(userId, artworkId) => {
        //1. Check user and artwork
        const currentUser = await User.findById(userId)
        const foundArtwork = await Artwork.findById(artworkId)
        if(!currentUser) throw new NotFoundError('User not found')
        if(!foundArtwork) throw new NotFoundError('Artwork not found')
        if(foundArtwork.artwork_likes.includes(currentUser._id.toString()))
            throw new BadRequestError('You did like this artwork') 

        //2. Like artwork
        foundArtwork.artwork_likes.push(userId)
        foundArtwork.save()
        return {
            artwork: foundArtwork
        }
    }

    static me = async(accessToken) => {
        //1. Decode accessToken and check
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        if(!decoded) throw new AuthFailureError('Invalid token')

        //2. Find user
        const userId = decoded.id
        if(!userId) throw new AuthFailureError('Invalid validation')

        //3. Return user without password
        const user = await User.findById(userId).select('-password')
        if(!user) throw new NotFoundError('User not found')

        return {
            user
        }
    }
}

export default UserService
