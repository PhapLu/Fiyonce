import { SuccessResponse } from "../core/success.response.js"
import ProposalService from "../services/proposal.service.js"

class ProposalController{
    sendProposal = async(req, res, next) => {
        new SuccessResponse({
            message: 'send proposal to inDirect order success!',
            metadata: await ProposalService.sendProposal(req.userId, req.params.orderId, req.body)
        }).send(res)
    }

    readProposal = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read an proposal',
            metadata: await ProposalService.readProposal(req.userId, req.params.proposalId)
        }).send(res)
    }

    readProposals = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all proposals of an order',
            metadata: await ProposalService.readProposals(req.params.orderId)
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

    confirmProposal = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Confirm proposal for inDirect order success!',
            metadata: await ProposalService.confirmProposal(req.userId, req.params.proposalId)
        }).send(res)
    }
    
}

export default new ProposalController()