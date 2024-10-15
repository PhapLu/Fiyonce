import ReportDashboardService from "../services/reportDashboard.service.js"
import { SuccessResponse } from "../core/success.response.js"

class ReportDashboardController{
    readReportOverview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get report overview success!',
            metadata: await ReportDashboardService.readReportOverview(req.userId)
        }).send(res)
    }
}

export default new ReportDashboardController()