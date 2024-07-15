import { SuccessResponse } from "../core/success.response.js"
import CommissionReportService from "../services/commissionReport.service.js"

class ServiceController{
    createCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create commissionReport success!',
            metadata: await CommissionReportService.createCommissionReport(req.userId, req)
        }).send(res)
    }

    readCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read commissionReport success!',
            metadata: await CommissionReportService.readCommissionReport(req.params.commissionReportId)
        }).send(res)
    }

    readCommissionReports = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read commissionReports success!',
            metadata: await CommissionReportService.readCommissionReports(req.userId)
        }).send(res)
    }

    updateCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update commissionReport success!',
            metadata: await CommissionReportService.updateCommissionReport(req.userId, req.params.commissionReportId, req)
        }).send(res)
    }

    deleteCommissionReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete commissionReport success!',
            metadata: await CommissionReportService.deleteCommissionReport(req.userId, req.params.commissionReportId)
        }).send(res)
    }

}

export default new ServiceController()