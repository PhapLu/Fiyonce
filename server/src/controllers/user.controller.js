import UserService from '../services/user.service.js'
import { SuccessResponse } from "../core/success.response.js"
import { BadRequestError } from '../core/error.response.js'

class UserController {
    //CRUD
    updateProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update userProfile successfully!',
            metadata: await UserService.updateProfile(req.userId, req.params.profileId, req.body)
        }).send(res)
    }

    readUserProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Read User profile success!',
            metadata: await UserService.readUserProfile(req.params.profileId)
        }).send(res)
    }

    deleteProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'User has been deleted!',
            metadata: await UserService.deleteProfile(req.userId, req.params.profileId)
        }).send(res)
    }

    followUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Follow user success!',
            metadata: await UserService.followUser(req.userId, req.params.profileId)
        }).send(res)
    }

    unFollowUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unfollow user success!',
            metadata: await UserService.unFollowUser(req.userId, req.params.profileId)
        }).send(res)
    }

    me = async (req, res, next) => {
        if (!req.cookies.accessToken) throw new BadRequestError('Access token missing', 403)
        new SuccessResponse({
            message: 'Me success!',
            metadata: await UserService.me(req.cookies.accessToken)
        }).send(res)
    }
    
    recommendUsers = async (req, res, next) => {
        new SuccessResponse({
            message: 'Recommend users success!',
            metadata: await UserService.recommendUsers(req.userId)
        }).send(res)
    }
}

export default new UserController()