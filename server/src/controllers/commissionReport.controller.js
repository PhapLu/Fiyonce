import { SuccessResponse } from "../core/success.response.js"
import CommissionReportService from "../services/commissionReport.service.js"

class ServiceController{
    createCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Bạn đã báo cáo thành công',
            metadata: await CommissionReportService.createCommissionReport(req.userId, req)
        }).send(res)
    }

    readCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem báo cáo thành công',
            metadata: await CommissionReportService.readCommissionReport(req.params.commissionReportId)
        }).send(res)
    }

    readCommissionReports = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem báo cáo thành công',
            metadata: await CommissionReportService.readCommissionReports(req.userId)
        }).send(res)
    }

    updateCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật bản báo cáo thành công',
            metadata: await CommissionReportService.updateCommissionReport(req.userId, req.params.commissionReportId, req)
        }).send(res)
    }

    deleteCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xóa bản báo cáo thành công',
            metadata: await CommissionReportService.deleteCommissionReport(req.userId, req.params.commissionReportId)
        }).send(res)
    }

}

export default new ServiceController()