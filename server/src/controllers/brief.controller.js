import { SuccessResponse } from "../core/success.response.js"
import BriefService from "../services/brief.service.js"

class BriefController{
    //Brief CRUD
    briefCommission = async(req, res, next) => {
        new SuccessResponse({
            message: 'Brief Commission to talent success!',
            metadata: await BriefService.briefCommission(req.userId, req.body)
        }).send(res)
    }

    readBrief = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read a Brief',
            metadata: await BriefService.readBrief(req.params.briefId)
        }).send(res)
    }

    readBriefs = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all Briefs',
            metadata: await BriefService.readBriefs() 
        }).send(res)
    }

    updateBrief = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update brief successfully!',
            metadata: await BriefService.updateBrief(req.userId, req.params.briefId, req.body)
        }).send(res)
    }

    deleteBrief = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete a brief successfully!',
            metadata: await BriefService.deleteBrief(req.userId, req.params.briefId)
        }).send(res)
    }
    //End Brief CRUD

    viewBriefHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all Briefs of a client',
            metadata: await BriefService.viewBriefHistory(req.userId)
        }).send(res)
    }

    applyBrief = async (req, res, next) => {
        new SuccessResponse({
            message: 'Apply Brief success!',
            metadata: await BriefService.applyBrief(req.userId, req.params.briefId, req.body)
        }).send(res)
    }
    submitPortfolio = async (req, res, next) => {
        new SuccessResponse({
            message: 'Apply Brief success!',
            metadata: await BriefService.submitPortfolio(req.userId, req.params.briefId, req.body)
        }).send(res)
    }

    chooseTalent = async (req, res, next) => {
        new SuccessResponse({
            message: 'Choose talent success!',
            metadata: await BriefService.chooseTalent(req.userId, req.params.briefId, req.body.talentId)
        }).send(res)
    }
}

export default new BriefController()