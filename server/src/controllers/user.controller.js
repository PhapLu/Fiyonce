import UserService from '../services/user.service.js'
import { CREATED, SuccessResponse } from "../core/success.response.js";
import { ErrorResponse, BadRequestError } from '../core/error.response.js';
import { User } from '../models/user.model.js';
import KeyTokenService from '../services/keyToken.service.js';

class UserController {
    //CRUD
    updateProfile = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update userProfile successfully!',
            metadata: await UserService.updateProfile(req.userId, req.params.id, req.body)
        }).send(res)
    }

    readUserProfile = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read User profile success!',
            metadata: await UserService.readUserProfile(req.params.profileId)
        }).send(res)
    }

    deleteProfile = async(req, res, next) => {
        new SuccessResponse({
            message: 'User has been deleted!',
            metadata: await UserService.deleteProfile(req.userId, req.params.profileId)
        }).send(res)
    }
    //End CRUD
    addToBookmark = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Add an artwork into bookmark success!',
            metadata: await UserService.addToBookmark(req.userId, req.params.artworkId)
        }).send(res)
    }
    //User send Request to upgrade role
    requestUpgradingToTalent = async(req, res, next) => {
        console.log(req.files);
        console.log(req.body);
        new SuccessResponse({
            message: 'Talent request submitted successfully.',
            metadata: await UserService.requestUpgradingToTalent(req.userId, req)
        }).send(res)
    }

    //Admin
    upgradeRoleToTalent = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update role to talent success!',
            metadata: await UserService.upgradeRoleToTalent(req.userId, req.params.requestId)
        }).send(res)
    }

    denyTalentRequest = async(req, res, next) => {
        new SuccessResponse({
            message: 'Deny talent request success!',
            metadata: await UserService.denyTalentRequest(req.userId, req.params.requestId)
        }).send(res)
    }
    
    viewTalentRequests = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent requests success!',
            metadata: await UserService.viewTalentRequests(req.userId)
        }).send(res)
    }

    viewTalentRequest = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent request success!',
            metadata: await UserService.viewTalentRequest(req.userId, req.params.requestId)
        }).send(res)
    }
    me = async(req, res, next) => {
        if(!req.cookies.accessToken) throw new BadRequestError('Access token missing', 403);
        new SuccessResponse({
            message: 'Me success!',
            metadata: await UserService.me(req.cookies.accessToken)
        }).send(res)
    }
    // createTalentCode = async(req, res, next) => {
    //     console.log('start create talent code')
    //     new SuccessResponse({
    //         message: 'Create talent code success!',
    //         metadata: await UserService.createTalentCode(req.user.userId, req.params.userId)
    //     }).send(res)
    // }
}

export default new UserController()