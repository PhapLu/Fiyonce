import TransactionDashboardService from "../services/transactionDashboard.service.js"
import { SuccessResponse } from "../core/success.response.js"

class TransactionDashboardController{
    readTransactionOverview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get transaction overview success!',
            metadata: await TransactionDashboardService.readTransactionOverview(req.userId)
        }).send(res)
    }
}

export default new TransactionDashboardController()