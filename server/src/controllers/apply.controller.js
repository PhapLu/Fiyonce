import { SuccessResponse } from "../core/success.response.js"
import ApplyService from "../services/apply.service.js"

class ApplyController{
    submitPortfolio = async(req, res, next) => {
        new SuccessResponse({
            message: 'Apply Brief success!',
            metadata: await ApplyService.submitPortfolio(req.userId, req.params.briefId, req.body)
        }).send(res)
    }

    readApply = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read an Apply',
            metadata: await ApplyService.readApply(req.params.applyId)
        }).send(res)
    }

    readApplies = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all Applies',
            metadata: await ApplyService.readApplies(req.params.briefId)
        }).send(res)
    }

    updateApply = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update apply successfully!',
            metadata: await ApplyService.updateApply(req.userId, req.params.applyId, req.body)
        }).send(res)
    }

    deleteApply = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete an apply successfully!',
            metadata: await ApplyService.deleteApply(req.userId, req.params.applyId)
        }).send(res)
    }

    viewAppliesHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all Applies of a client',
            metadata: await ApplyService.viewAppliesHistory(req.userId)
        }).send(res)
    }

}

export default new ApplyController()