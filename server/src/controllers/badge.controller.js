import { SuccessResponse } from "../core/success.response.js"
import BadgeService from "../services/badge.service.js"

class BadgeController{
    readEarlyBirdBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read early bird badge success!',
            metadata: await BadgeService.readEarlyBirdBadge(req.userId)
        }).send(res)
    }

    readTrustedArtistBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read trusted artist badge success!',
            metadata: await BadgeService.readTrustedArtistBadge(req.userId)
        }).send(res)
    }

    readPlatformAmbassadorBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read platform ambassador badge success!',
            metadata: await BadgeService.readPlatformAmbassadorBadge(req.userId)
        }).send(res)
    }

    createBadge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create badges success!',
            metadata: await BadgeService.createBadge(req.userId, req)
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