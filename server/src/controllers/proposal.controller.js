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
            metadata: await ProposalService.readProposal(req, req.params.proposalId)
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

    confirmProposal = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update proposal successfully!',
            metadata: await ProposalService.confirmProposal(req.userId, req.params.proposalId, req.body)
        }).send(res)
    }

    deleteProposal = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete an proposal successfully!',
            metadata: await ProposalService.deleteProposal(req.userId, req.params.proposalId)
        }).send(res)
    }

    generatePaymentUrl = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Generate payment url success!',
            metadata: await ProposalService.generatePaymentUrl(req.userId, req.params.proposalId)
        }).send(res)
    }

    bindPaymentAccount = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Bind payment account success!',
            metadata: await ProposalService.bindPaymentAccount(req.userId, req.body)
        }).send(res)
    }

    momoCallback = async(req, res, next) =>{
        new SuccessResponse({
            message: 'MoMo callback success!',
            metadata: await ProposalService.momoCallback(req.body)
        }).send(res)
    }

    readMomoOrderStatus = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Confirm proposal for inDirect order success!',
            metadata: await ProposalService.readMomoOrderStatus(req.body)
        }).send(res)
    }
    
    denyProposal = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Deny the proposal success!',
            metadata: await ProposalService.denyProposal(req.userId, req.params.proposalId)
        }).send(res)
    }
}

export default new ProposalController()