import UserService from '../services/user.service.js'
import { CREATED, SuccessResponse } from "../core/success.response.js"
import { ErrorResponse, BadRequestError } from '../core/error.response.js'
import { User } from '../models/user.model.js'
import KeyTokenService from '../services/keyToken.service.js'

class UserController {
    //CRUD
    updateProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật thông tin thành công',
            metadata: await UserService.updateProfile(req.userId, req.body)
        }).send(res)
    }

    readUserProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Xem thông tin thành công',
            metadata: await UserService.readUserProfile(req.params.profileId)
        }).send(res)
    }

    deleteProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Đã xóa profile thành công!',
            metadata: await UserService.deleteProfile(req.userId)
        }).send(res)
    }
    //End CRUD

    followUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Đã theo dõi thành công',
            metadata: await UserService.followUser(req.userId, req.params.profileId)
        }).send(res)
    }

    unFollowUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Đã hủy theo dõi thành công',
            metadata: await UserService.unFollowUser(req.userId, req.params.profileId)
        }).send(res)
    }

    me = async (req, res, next) => {
        if (!req.cookies.accessToken) throw new BadRequestError('Access token missing', 403)
        new SuccessResponse({
            message: 'Đọc thông tin thành công',
            metadata: await UserService.me(req.cookies.accessToken)
        }).send(res)
    }
}

export default new UserController()