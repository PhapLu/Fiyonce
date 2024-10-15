import { User } from "../models/user.model.js"
import CommissionReport from "../models/commissionReport.model.js"
import AccountReport from "../models/accountReport.model.js"
import BugReport from "../models/bugReport.model.js"
import {
    AuthFailureError,
    NotFoundError,
} from "../core/error.response.js"

class ReportDashboardService {
    static readReportOverview = async (userId) => {
        //1. Check user
        const admin = await User.findById(userId)
        if (!admin) throw new NotFoundError("User not found")
        if (admin.role !== "admin") throw new AuthFailureError("User is not admin")

        //2. Get counts for each type of report
        const commissionReportCount = await CommissionReport.countDocuments()
        const accountReportCount = await AccountReport.countDocuments()
        const bugReportCount = await BugReport.countDocuments()
        const totalReports = commissionReportCount + accountReportCount + bugReportCount

        return {
            reportOverview : {
                totalReports,
                accountReportCount,
                commissionReportCount,
                bugReportCount
            }
        }
    }
}

export default ReportDashboardService
