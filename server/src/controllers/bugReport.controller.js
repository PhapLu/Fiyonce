import { SuccessResponse } from "../core/success.response.js"
import BugReportService from "../services/bugReport.service.js"

class ServiceController{
    createBugReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create bugReport success!',
            metadata: await BugReportService.createBugReport(req.userId, req)
        }).send(res)
    }

    readBugReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read bugReport success!',
            metadata: await BugReportService.readBugReport(req.params.bugReportId)
        }).send(res)
    }

    readBugReports = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read bugReports success!',
            metadata: await BugReportService.readBugReports(req.userId)
        }).send(res)
    }

    updateBugReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update bugReport success!',
            metadata: await BugReportService.updateBugReport(req.userId, req.params.bugReportId, req)
        }).send(res)
    }

    deleteBugReport = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete bugReport success!',
            metadata: await BugReportService.deleteBugReport(req.userId, req.params.bugReportId)
        }).send(res)
    }

}

export default new ServiceController()