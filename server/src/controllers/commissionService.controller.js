import { SuccessResponse } from "../core/success.response.js"
import CommissionServiceService from "../services/commissionService.service.js"

class ServiceController{
    createCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tạo dịch vụ thành công',
            metadata: await CommissionServiceService.createCommissionService(req.userId, req)
        }).send(res)
    }

    readCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem dịch vụ thành công',
            metadata: await CommissionServiceService.readCommissionService(req.params.commissionServiceId)
        }).send(res)
    }

    readCommissionServices = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem dịch vụ thành công',
            metadata: await CommissionServiceService.readCommissionServices(req.params.talentId)
        }).send(res)
    }

    updateCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật dịch vụ thành công!',
            metadata: await CommissionServiceService.updateCommissionService(req.userId, req.params.commissionServiceId, req)
        }).send(res)
    }

    deleteCommissionService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xóa dịch vụ thành công',
            metadata: await CommissionServiceService.deleteCommissionService(req.userId, req.params.commissionServiceId)
        }).send(res)
    }

}

export default new ServiceController()