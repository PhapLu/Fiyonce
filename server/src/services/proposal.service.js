import https from 'https'
import crypto from 'crypto'
import Order from "../models/order.model.js"
import axios from 'axios'
import Artwork from "../models/post.model.js"
import sendEmail from '../middlewares/sendMail.js'
import Proposal from "../models/proposal.model.js"
import MomoService from './momo.service.js'
import { User } from "../models/user.model.js"
import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"

const accessKey = 'F8BBA842ECF85'
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'

class ProposalService {
    static sendProposal = async (userId, orderId, body) => {
        console.log("BODY")
        console.log(body)
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError('User not found')
        if (!order) throw new NotFoundError('Order not found')

        //2. Check if user is a talent
        if (user.role !== 'talent')
            throw new AuthFailureError('You are not a talent')

        //3. Check if user has already given proposal for the order
        const existingProposal = await Proposal.findOne({ talentId: userId, orderId })
        if (existingProposal)
            throw new BadRequestError('You have already given proposal for this order')

        //4. Check if artworks are valid
        if (body.artworks.length === 0)
            throw new BadRequestError('Artworks are required')

        //5.Check if price is valid
        if (body.price < 0)
            throw new BadRequestError('Price must be greater than 0')

        //6. Send proposal
        const proposal = new Proposal({
            orderId,
            talentId: userId,
            termOfServiceId: body.termOfServiceId,
            artworks: body.artworks,
            ...body
        })
        await proposal.save()

        //7. Modify the order status to approved
        order.status = 'approved'
        order.save()

        const showedProposal = await proposal.populate('orderId')

        //sendEmail(user.email, 'Proposal sent', 'Your proposal has been sent successfully')
        return {
            proposal: showedProposal
        }
    }

    static readProposal = async (userId, proposalId) => {
        //1. Check if proposal, user exists
        const proposal = await Proposal.findById(proposalId).populate('termOfServiceId').populate('artworks', 'url')
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User not found')
        if (!proposal) throw new NotFoundError('Proposal not found')

        return {
            proposal
        }
    }
    static readProposalsByOrderId = async (orderId) => {
        //1. Check if order exists
        const order = await Order.findById(orderId)
        if (!order) throw new NotFoundError('Order not found')

        //2. Read all proposals of a order
        const proposals = await Proposal.find({ orderId: orderId }).populate('talentChosenId', 'fullName avatar')

        return {
            proposals
        }
    }
    static updateProposal = async (userId, proposalId, body) => {
        //1. Check if proposal, user exists
        const user = await User.findById(userId)
        const proposal = await Proposal.findById(proposalId)
        if (!proposal) throw new NotFoundError('Proposal not found')
        if (!user) throw new NotFoundError('User not found')

        //2. Check if user is authorized to update proposal
        if (proposal.talentId.toString() !== userId)
            throw new AuthFailureError('You are not authorized to update this proposal')

        //3. Check order status
        const order = await Order.findById(proposal.orderId)
        if (order.status !== 'pending' && order.status !== 'approved')
            throw new BadRequestError('You cannot update proposal on this stage')

        //4. Update proposal
        const updatedProposal = await Proposal.findByIdAndUpdate(
            proposalId,
            {
                $set: body
            },
            { new: true }
        )
        await proposal.save()

        //5. Send email to user
        // try {
        //     await sendEmail(member.email, 'Proposal updated', 'The proposal of your order has been updated by talent')
        // } catch (error) {
        //     throw new Error('Email service error')
        // }

        return {
            proposal: updatedProposal
        }
    }

    static deleteProposal = async (userId, proposalId) => {
        //1. Check proposal, user exists
        const proposal = await Proposal.findById(proposalId)
        const user = await User.findById(userId)
        if (!proposal) throw new NotFoundError('Proposal not found')
        if (!user) throw new NotFoundError('User not found')

        //2. Check if user is authorized to delete proposal
        if (proposal.talentId.toString() !== userId)
            throw new AuthFailureError('You are not authorized to delete this proposal')

        //3. Check status of order
        const order = await Order.findById(proposal.orderId)
        if (order.status !== 'pending' && order.status !== 'approved')
            throw new BadRequestError('You cannot update proposal on this stage')

        //4. Delete proposal
        await proposal.deleteOne()

        return {
            proposal
        }
    }
    static readProposalsHistory = async (userId) => {
        //1. Check if user exists
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User not found')

        //2. View all proposals of a talent
        const proposals = await Proposal.find({ talentId: userId })
        return {
            proposals
        }
    }

    static generatePaymentUrl = async(userId, proposalId) => {
        //1. Check if user exists
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User not found')

        //2. Check if proposal exists
        const proposal = await Proposal.findById(proposalId)
        if (!proposal) throw new NotFoundError('Proposal not found')

        //3. Check if order exists and is approved
        const order = await Order.findById(proposal.orderId)
        if (!order) throw new NotFoundError('Order not found')
        // if (order.status !== 'approved') throw new BadRequestError('Order is not approved')

        //4. Create payment with MoMo
        const amount = proposal.price
        const paymentData = await MomoService.generatePaymentData(amount)

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(paymentData))
            },
            data: JSON.stringify(paymentData)
        }

        let paymentResponse
        try {
            paymentResponse = await axios(options)
        } catch (error) {
            console.log('Error generating payment URL: ', error)
        }

        //5. Update order with MoMo order id
        order.momoOrderId = paymentResponse.data.orderId
        await order.save()
        console.log(order)
        
        return {
            paymentData,
            paymentResponse: paymentResponse.data
        }
    }

    static momoCallback = async(body) => {
        console.log('Call back:: ')
        console.log(body)
        //Confirm order
        const order = await Order.findOne({momoOrderId: body.orderId})
        order.status = 'confirmed'
        await order.save()

        return {
            order,
            body
        }
    }

    static confirmProposal = async (userId, proposalId, body) => {
        const {orderId} = body

        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`

        const signature = crypto
        .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex')

        const requestBody = {
            partnerCode: 'MOMO',
            requestId: orderId,
            orderId,
            signature,
            lang: 'vi'
        }

        //options for axios
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/query',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody
        }

        let result = await axios(options)

        return {
            result: result.data
        }
    }
    
    // static confirmProposal = async (userId, proposalId) => {
    //     // 1. Check if user exists
    //     const user = await User.findById(userId)
    //     if (!user) throw new NotFoundError('User not found')

    //     // 2. Check if proposal exists
    //     const proposal = await Proposal.findById(proposalId)
    //     // if (!proposal) throw new NotFoundError('Proposal not found')

    //     // 3. Check if talent exists
    //     const talent = await User.findById(proposal.talentId)
    //     // if (!talent) throw new NotFoundError('Talent not found')

    //     // 4. Check if order exists and is approved
    //     const order = await Order.findById(proposal.orderId)
    //     // if (!order) throw new NotFoundError('Order not found')
    //     // if (order.status !== 'approved') throw new BadRequestError('Order is not approved')

    //     // 5. Create payment with MoMo
    //     // const amount = proposal.price
    //     // const paymentData = await MomoService.generatePaymentData(amount)
        // const options = {
        //     hostname: 'test-payment.momo.vn',
        //     port: 443,
        //     path: '/v2/gateway/api/create',
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Content-Length': Buffer.byteLength(JSON.stringify(paymentData))
        //     }
        // }

    //     // const paymentResponse = await new Promise((resolve, reject) => {
    //     //     const apiReq = https.request(options, apiRes => {
    //     //         let data = ''
    //     //         apiRes.on('data', chunk => { data += chunk })
    //     //         apiRes.on('end', () => { resolve(JSON.parse(data)) })
    //     //     })

    //     //     apiReq.on('error', error => { reject(`Error: ${error.message}`) })
    //     //     apiReq.write(JSON.stringify(paymentData))
    //     //     apiReq.end()
    //     // })

    //     // 6. Confirm proposal
    //     order.status = 'confirmed'
    //     if (!order.talentChosenId) {
    //         order.talentChosenId = proposal.talentId
    //     }
    //     await order.save()

    //     // Refresh proposal to get updated data after save
    //     const updatedProposal = await Proposal.findById(proposalId)

    //     // 7. Send email to talent
    //     try {
    //         await sendEmail(talent.email, 'Proposal confirmed', 'Your proposal has been confirmed by client')
    //     } catch (error) {
    //         throw new Error('Email service error')
    //     }

    //     return {
    //         proposal: updatedProposal,
    //         // paymentData: paymentResponse,
    //         // paymentResponse: paymentResponse
    //     }
    // }
}

export default ProposalService