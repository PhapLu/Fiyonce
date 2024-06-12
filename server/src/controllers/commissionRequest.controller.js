import { SuccessResponse } from "../core/success.response.js"
import CommissionRequestService from "../services/commissionRequest.service.js"

class CommissionRequestController{
    //CommissionRequest CRUD
    requestCommission = async(req, res, next) => {
        new SuccessResponse({
            message: 'Send commission request to talent success!',
            metadata: await CommissionRequestService.requestCommission(req.userId, req.body)
        }).send(res)
    }

    readCommissionRequest = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read a commissionRequest',
            metadata: await CommissionRequestService.readCommissionRequest(req.params.commissionRequestId)
        }).send(res)
    }

    readCommissionRequests = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all commissionRequests',
            metadata: await CommissionRequestService.readCommissionRequests() 
        }).send(res)
    }

    updateCommissionRequest = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update commissionRequest successfully!',
            metadata: await CommissionRequestService.updateCommissionRequest(req.userId, req.params.commissionRequestId, req.body)
        }).send(res)
    }

    deleteCommissionRequest = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete a commissionRequest successfully!',
            metadata: await CommissionRequestService.deleteCommissionRequest(req.userId, req.params.commissionRequestId)
        }).send(res)
    }
    //End CommissionRequest CRUD

    viewCommissionRequestHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all CommissionRequests of a client',
            metadata: await CommissionRequestService.viewCommissionRequestHistory(req.userId)
        }).send(res)
    }

    chooseTalent = async (req, res, next) => {
        new SuccessResponse({
            message: 'Choose talent success!',
            metadata: await CommissionRequestService.chooseTalent(req.userId, req.params.commissionRequestId, req.body.talentId)
        }).send(res)
    }
}

export default new CommissionRequestController()