import { SuccessResponse } from "../core/success.response.js"
import ProposalService from "../services/proposal.service.js"

class ProposalController{
    submitPortfolio = async(req, res, next) => {
        new SuccessResponse({
            message: 'Proposal Brief success!',
            metadata: await ProposalService.submitPortfolio(req.userId, req.params.briefId, req.body)
        }).send(res)
    }

    readProposal = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read an Proposal',
            metadata: await ProposalService.readProposal(req.params.proposalId)
        }).send(res)
    }

    readProposals = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all Proposals',
            metadata: await ProposalService.readProposals(req.params.briefId)
        }).send(res)
    }

    updateProposal = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update proposal successfully!',
            metadata: await ProposalService.updateProposal(req.userId, req.params.proposalId, req.body)
        }).send(res)
    }

    deleteProposal = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete an proposal successfully!',
            metadata: await ProposalService.deleteProposal(req.userId, req.params.proposalId)
        }).send(res)
    }

    viewProposalsHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all Proposals of a client',
            metadata: await ProposalService.viewProposalsHistory(req.userId)
        }).send(res)
    }

}

export default new ProposalController()