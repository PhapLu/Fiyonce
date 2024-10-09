import { SuccessResponse } from "../core/success.response.js"
import BadgeService from "../services/badge.service.js"

class BadgeController{
    readBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read early bird badge success!',
            metadata: await BadgeService.readBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }

    awardBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Award early bird badge success!',
            metadata: await BadgeService.awardBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }
}

export default new BadgeController()