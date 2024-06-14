import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import Proposal from "../models/proposal.model.js"
import Order from "../models/order.model.js"
import { User } from "../models/user.model.js"
import {artwork} from "../models/artwork.model.js"

class ProposalService{
    static sendProposal = async(userId, orderId, body) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if(!user) throw new NotFoundError('User not found')
        if(!order) throw new NotFoundError('Order not found')

        //2. Check if user is a talent
        if(user.role !== 'talent')
            throw new AuthFailureError('You are not a talent')

        //3. Check if user has already given proposal for the order
        const existingProposal = await Proposal.findOne({talentId: userId, orderId})
        if(existingProposal)
            throw new BadRequestError('You have already given proposal for this order')

        // //4. Check if artworks are valid
        // if(body.artworks){
        //     const artworks = await artwork.find({_id: body.artworks})
        //     if(artworks.length !== body.artworks.length)
        //         throw new BadRequestError('Several artworks are not found')
        // }
        
        //5.Check if price is valid
        if(body.price < 0)
            throw new BadRequestError('Price must be greater than 0')
        
        //6. Modify the order status to accepted
        order.status = 'accepted'
        order.save()

        //7. Submit portfolio
        const proposal = new Proposal({
            orderId,
            memberId: order.memberId,
            talentId: userId,
            artworks: body.artworks,
            price: body.price,
            ...body
        })
        await proposal.save()
        const showedProposal = await proposal.populate('orderId')
        console.log('Proposal:', showedProposal);
        return {
            proposal: showedProposal
        }
    }
    static readProposal = async(userId, proposalId) => {
        //1. Check if proposal exists
        const proposal = await Proposal.findById(proposalId).populate('orderId') 
        if(!proposal) throw new NotFoundError('Proposal not found')

        return {
            proposal
        }
    }
    static readProposals = async(orderId) => {
        //1. Check if order exists
        const order = await Order.findById(orderId)
        if(!order) throw new NotFoundError('Order not found')

        //2. Read all proposals of a order
        const proposals = await Proposal.find({orderId: orderId})
        return {
            proposals
        }
    }
    static updateProposal = async(userId, proposalId, body) => {
        //1. Check if proposal, user exists
        const user = await User.findById(userId)
        const proposal = await Proposal.findById(proposalId)
        if(!proposal) throw new NotFoundError('Proposal not found')
        if(!user) throw new NotFoundError('User not found')

        //2. Check if user is authorized to update proposal
        if(proposal.talentId.toString() !== userId) 
            throw new AuthFailureError('You are not authorized to update this proposal')
        
        //3. Check order status
        const order = await Order.findById(proposal.orderId)
        if(order.status !== 'pending' && order.status !== 'accepted') 
            throw new BadRequestError('You cannot update proposal on this stage')

        //4. Update proposal
        const updatedProposal = await Proposal.findByIdAndUpdate(
            proposalId,
            {
                $set: body
            },
            {new: true}
        )
        await proposal.save()

        return {
            proposal: updatedProposal
        }
    }

    static deleteProposal = async(userId, proposalId) => {
        //1. Check proposal, user exists
        const proposal = await Proposal.findById(proposalId)
        const user = await User.findById(userId)
        if(!proposal) throw new NotFoundError('Proposal not found')
        if(!user) throw new NotFoundError('User not found')

        //2. Check if user is authorized to delete proposal
        if(proposal.talentId.toString() !== userId) 
            throw new AuthFailureError('You are not authorized to delete this proposal')
        
        //3. Check status of order
        const order = await Order.findById(proposal.orderId)
        if(order.status !== 'pending' && order.status !== 'accepted')
            throw new BadRequestError('You cannot update proposal on this stage')

        //4. Delete proposal
        await proposal.remove()
        return {
            proposal
        }
    }
    static viewProposalsHistory = async(userId) => {
        //1. Check if user exists
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError('User not found')

        //2. View all proposals of a talent
        const proposals = await Proposal.find({talentId: userId})
        return {
            proposals
        }
    }
}

export default ProposalService