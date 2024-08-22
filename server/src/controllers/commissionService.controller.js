import { SuccessResponse } from "../core/success.response.js"
import CommissionServiceService from "../services/commissionService.service.js"

class ServiceController{
    createCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create service success!',
            metadata: await CommissionServiceService.createCommissionService(req.userId, req)
        }).send(res)
    }

    readCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read service success!',
            metadata: await CommissionServiceService.readCommissionService(req, req.params.commissionServiceId)
        }).send(res)
    }

    readCommissionServices = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read services success!',
            metadata: await CommissionServiceService.readCommissionServices(req.params.talentId)
        }).send(res)
    }

    updateCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update service success!',
            metadata: await CommissionServiceService.updateCommissionService(req.userId, req.params.commissionServiceId, req)
        }).send(res)
    }

    deleteCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete service success!',
            metadata: await CommissionServiceService.deleteCommissionService(req.userId, req.params.commissionServiceId)
        }).send(res)
    }

    bookmarkCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Bookmark service success!',
            metadata: await CommissionServiceService.bookmarkCommissionService(req.userId, req.params.commissionServiceId)
        }).send(res)
    }

}

export default new ServiceController()