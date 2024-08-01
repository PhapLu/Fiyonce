import { CREATED, SuccessResponse } from "../core/success.response.js"
import SubmissionService from "../services/submission.service.js"

class SubmissionController {
    createSubmission = async(req, res, next) => {
        new SuccessResponse({
            message: 'Talent request submitted successfully.',
            metadata: await SubmissionService.createSubmission(req.userId, req.params.challengeId, req)
        }).send(res)
    }

    updateSubmission = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update talent request success!',
            metadata: await SubmissionService.updateSubmission(req.userId, req.params.submissionId, req)
        }).send(res)
    }
    
    readSubmissions = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent requests success!',
            metadata: await SubmissionService.readSubmissions()
        }).send(res)
    }

    readSubmission = async(req, res, next) => {
        new SuccessResponse({
            message: 'View talent request success!',
            metadata: await SubmissionService.readSubmission(req.params.submissionId)
        }).send(res)
    }
}

export default new SubmissionController()