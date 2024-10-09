import { SuccessResponse } from "../core/success.response.js"
import BadgeService from "../services/badge.service.js"

class BadgeController{
    readEarlyBirdBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read early bird badge success!',
            metadata: await BadgeService.readEarlyBirdBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }

    readTrustedArtistBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read trusted artist badge success!',
            metadata: await BadgeService.readTrustedArtistBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }

    readPlatformAmbassadorBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read platform ambassador badge success!',
            metadata: await BadgeService.readPlatformAmbassadorBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }

    awardEarlyBirdBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Award early bird badge success!',
            metadata: await BadgeService.awardEarlyBirdBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }

    awardTrustedArtistBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Award trusted artist badge success!',
            metadata: await BadgeService.awardTrustedArtistBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }

    awardPlatformAmbassadorBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Award platform ambassador badge success!',
            metadata: await BadgeService.awardPlatformAmbassadorBadge(req.userId, req.params.badgeKey)
        }).send(res)
    }
}

export default new BadgeController()