import ArtistryDashboardService from "../services/artistryDashboard.service.js"
import { SuccessResponse } from "../core/success.response.js"

class ArtistryDashboardController{
    readBadgeOverview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create accountReport success!',
            metadata: await ArtistryDashboardService.readBadgeOverview(req.userId)
        }).send(res)
    }

    readBadgeAchievedOverview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create accountReport success!',
            metadata: await ArtistryDashboardService.readBadgeAchievedOverview(req.userId)
        }).send(res)
    }
    
    readChallengeOverview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create accountReport success!',
            metadata: await ArtistryDashboardService.readChallengeOverview(req.userId)
        }).send(res)
    }
}

export default new ArtistryDashboardController()