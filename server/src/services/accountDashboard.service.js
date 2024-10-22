import TalentRequest from "../models/talentRequest.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"

class AccountDashboardService {
    static readAccountOverview = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== "admin")
            throw new AuthFailureError("Bạn không phải là admin")

        //2. Get counts
        const userCount = await User.countDocuments()
        const adminCount = await User.countDocuments({ role: "admin" })
        const talentCount = await User.countDocuments({ role: "talent" })
        const memberCount = await User.countDocuments({ role: "member" })
        const talentRequestCount = await TalentRequest.countDocuments({ status: "pending" })

        return {
            accountOverview: {
                userCount,
                adminCount,
                talentCount,
                memberCount,
                talentRequestCount,
            }
        }
    }
}

export default AccountDashboardService
