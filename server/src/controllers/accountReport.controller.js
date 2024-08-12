import { SuccessResponse } from "../core/success.response.js"
import AccountReportService from "../services/accountReport.service.js"

class ServiceController{
    createAccountReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create accountReport success!',
            metadata: await AccountReportService.createAccountReport(req.userId, req)
        }).send(res)
    }

    readAccountReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read accountReport success!',
            metadata: await AccountReportService.readAccountReport(req.params.accountReportId)
        }).send(res)
    }

    readAccountReports = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read accountReports success!',
            metadata: await AccountReportService.readAccountReports(req.userId)
        }).send(res)
    }

    updateAccountReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update accountReport success!',
            metadata: await AccountReportService.updateAccountReport(req.userId, req.params.accountReportId, req)
        }).send(res)
    }

    deleteAccountReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete accountReport success!',
            metadata: await AccountReportService.deleteAccountReport(req.userId, req.params.accountReportId)
        }).send(res)
    }

}

export default new ServiceController()