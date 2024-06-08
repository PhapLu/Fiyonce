import { CREATED, SuccessResponse } from "../core/success.response.js";
import TalentRequestService from "../services/talentRequest.service.js";

class TalentRequestController {
    requestUpgradingToTalent = async(req, res, next) => {
        new SuccessResponse({
            message: 'Talent request submitted successfully.',
            metadata: await TalentRequestService.requestUpgradingToTalent(req.userId, req)
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
        new SuccessResponse({
            message: 'Deny talent request success!',
            metadata: await TalentRequestService.denyTalentRequest(req.userId, req.params.requestId)
        }).send(res)
    }
    
    viewTalentRequests = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent requests success!',
            metadata: await TalentRequestService.viewTalentRequests(req.userId)
        }).send(res)
    }

    viewTalentRequest = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent request success!',
            metadata: await TalentRequestService.viewTalentRequest(req.userId, req.params.requestId)
        }).send(res)
    }
}

export default new TalentRequestController()