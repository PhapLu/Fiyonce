import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js";
import { User } from "../models/user.model.js";
import TalentRequest from "../models/talentRequest.model.js";

class AccountDashboardService{
    static readAccountOverview = async(userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User not found')
        if (user.role !== 'admin') throw new AuthFailureError('You are not the admin')
    
        //2. Get counts
        const userCount = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        const talentCount = await User.countDocuments({ role: 'talent' });
        const memberCount = await User.countDocuments({ role: 'member' });
        const talentRequestCount = await TalentRequest.countDocuments();
        
        return {
            userCount,
            adminCount,
            talentCount,
            memberCount,
            talentRequestCount
        };
    }
}

export default AccountDashboardService
