import AccountDashboardService from "../services/accountDashboard.service.js"
import { SuccessResponse } from "../core/success.response.js"

class AccountDashboardController{
    readAccountOverview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get account overview success!',
            metadata: await AccountDashboardService.readAccountOverview(req.userId)
        }).send(res)
    }
}

export default new AccountDashboardController()