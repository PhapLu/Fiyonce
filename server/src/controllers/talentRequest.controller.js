import { CREATED, SuccessResponse } from "../core/success.response.js"
import TalentRequestService from "../services/talentRequest.service.js"

class TalentRequestController {
    requestUpgradingToTalent = async(req, res, next) => {
        new SuccessResponse({
            message: 'Talent request submitted successfully.',
            metadata: await TalentRequestService.requestUpgradingToTalent(req.userId, req)
        }).send(res)
    }

    requestSupplement = async(req, res, next) => {
        new SuccessResponse({
            message: 'Request supplement success!',
            metadata: await TalentRequestService.requestSupplement(req.userId, req.body)
        }).send(res)
    }
    
    readMyTalentRequest = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read talent request status success!',
            metadata: await TalentRequestService.readMyTalentRequest(req.userId)
        }).send(res)
    }
    //Admin
    upgradeRoleToTalent = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update role to talent success!',
            metadata: await TalentRequestService.upgradeRoleToTalent(req.userId, req.params.requestId)
        }).send(res)
    }

    denyTalentRequest = async(req, res, next) => {
        console.log(req.body)
        new SuccessResponse({
            message: 'Deny talent request success!',
            metadata: await TalentRequestService.denyTalentRequest(req.userId, req.params.requestId, req.body)
        }).send(res)
    }
    
    readTalentRequestsByStatus = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent requests success!',
            metadata: await TalentRequestService.readTalentRequestsByStatus(req.userId, req.params.status)
        }).send(res)
    }

    readTalentRequest = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent request success!',
            metadata: await TalentRequestService.readTalentRequest(req.userId, req.params.requestId)
        }).send(res)
    }
}

export default new TalentRequestController()