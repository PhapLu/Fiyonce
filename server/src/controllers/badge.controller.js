import { SuccessResponse } from "../core/success.response.js"
import BadgeService from "../services/badge.service.js"

class BadgeController{
    createBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create badges success!',
            metadata: await BadgeService.createBadge(req.userId, req)
        }).send(res)
    }

    readBadges = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read badges success!',
            metadata: await BadgeService.readBadges()
        }).send(res)
    }

    updateBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update badge success!',
            metadata: await BadgeService.updateBadge(req.userId, req.params.badgeId, req)
        }).send(res)
    }

    deleteBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete badge success!',
            metadata: await BadgeService.deleteBadge(req.userId, req.params.badgeId)
        }).send(res)
    }

    awardEarlyBirdBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Award early bird badge success!',
            metadata: await BadgeService.awardEarlyBirdBadge(req.userId, req.params.userId)
        }).send(res)
    }
}

export default new BadgeController()