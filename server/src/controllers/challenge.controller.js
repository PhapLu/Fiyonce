import { SuccessResponse } from "../core/success.response.js"
import ChallengeService from "../services/challenge.service.js"

class ChallengeController{
    createChallenge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create challenges success!',
            metadata: await ChallengeService.createChallenge(req.userId, req)
        }).send(res)
    }

    readChallenge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read challenge success!',
            metadata: await ChallengeService.readChallenge(req.params.challengeId)
        }).send(res)
    }

    readChallenges = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read challenges success!',
            metadata: await ChallengeService.readChallenges()
        }).send(res)
    }

    updateChallenge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update challenge success!',
            metadata: await ChallengeService.updateChallenge(req.userId, req.params.challengeId, req)
        }).send(res)
    }

    deleteChallenge = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete challenge success!',
            metadata: await ChallengeService.deleteChallenge(req.userId, req.params.challengeId)
        }).send(res)
    }
}

export default new ChallengeController()