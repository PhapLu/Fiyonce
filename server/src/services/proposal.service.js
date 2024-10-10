import https from "https"
import crypto from "crypto"
import Order from "../models/order.model.js"
import axios from "axios"
import Artwork from "../models/post.model.js"
import Proposal from "../models/proposal.model.js"
import CommissionService from "../models/commissionService.model.js"
import MomoService from "./momo.service.js"

import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import { sendAnnouncementEmail, sendCommissionEmail } from "../configs/brevo.email.config.js"
import { formatDate } from "../utils/index.js"

const accessKey = "F8BBA842ECF85"
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"

class ProposalService {
    static sendProposal = async (userId, orderId, body) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy dịch vụ")

        //2. Check if user is a talent
        if (user.role !== "talent")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");
        if(!user.taxCode || !user.taxCode.code || user.taxCode.isVerified === false) 
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này");

        //3. Check if user has already given proposal for the order
        const existingProposal = await Proposal.findOne({
            talentId: userId,
            orderId,
        })
        if (existingProposal)
            throw new BadRequestError("Bạn đã gửi đơn ứng cho đơn hàng này rồi")

        //5.Check if price is valid
        if (body.price < 0)
            throw new BadRequestError("Giá trị đơn hàng phải lớn hơn 0")

        let proposal
        const member = await User.findById(order.memberId).select("email avatar fullName")
        const talent = await User.findById(userId).select("email stageName avatar fullName")
        const subject = `PASTAL - Yêu cầu đặt hàng đã được chấp nhận (${formatDate()})`
        const price = `Do họa sĩ đề xuất: <span>${body.price}</span> VNĐ`
        const orderCode = `Mã đơn hàng: <span class="code">${order._id.toString()}</span>`
        
        //4. Check if artworks are valid
        if (order.isDirect) {
            const commissionService = await CommissionService.findById(order.commissionServiceId)
            
            //5. Send proposal
            proposal = new Proposal({
                orderId,
                talentId: userId,
                termOfServiceId: commissionService.termOfServiceId,
                ...body,
            })

            //6. Send email to user
            const subSubject = `Họa sĩ ${talent.fullName} đã chấp nhận yêu cầu đặt hàng của bạn`
            const message = `"${proposal.scope}"`
            sendCommissionEmail(member.email, talent, subject, subSubject, message, orderCode, price)
        } else {
            if (body.artworks.length === 0) throw new BadRequestError("Hãy cung cấp tranh")
            
            //5. Send proposal
            proposal = new Proposal({
                orderId,
                talentId: userId,
                termOfServiceId: body.termOfServiceId,
                artworks: body.artworks,
                ...body,
            })

            //6. Send email to user
            const subSubject = `Họa sĩ ${talent.fullName} đã ứng đơn hàng của bạn trên chợ Commission`
            const message = `"${proposal.scope}"`
            sendCommissionEmail(member.email, talent, subject, subSubject, message, orderCode, price)
        }

        await proposal.save()

        //7. Modify the order status to approved
        order.status = "approved"
        await order.save()

        const showedProposal = await proposal.populate("orderId")
        return {
            proposal: showedProposal,
        }
    }

    static readProposal = async (userId, proposalId) => {
        //1. Check if proposal, user exists
        const proposal = await Proposal.findById(proposalId)
            .populate("termOfServiceId")
            .populate("artworks", "url")
            .populate("talentId", "stageName fullName avatar");
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!proposal) throw new NotFoundError("Không tìm thấy hợp đồng");

        return {
            proposal,
        }
    }
    static readProposals = async (orderId) => {
        //1. Check if order exists
        const order = await Order.findById(orderId)
        if (!order) throw new NotFoundError("Không tìm thấy dịch vụ")

        //2. Read all proposals of a order
        const proposals = await Proposal.find({ orderId: orderId }).populate(
            "talentId",
            "fullName avatar"
        ).populate("artworks", "url")

        return {
            proposals,
        }
    }
    static updateProposal = async (userId, proposalId, body) => {
        //1. Check if proposal, user exists
        const user = await User.findById(userId);
        const proposal = await Proposal.findById(proposalId);
        if (!proposal) throw new NotFoundError("Không tìm thấy hợp đồng");
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if(!user.taxCode || !user.taxCode.code || user.taxCode.isVerified === false) 
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này");

        //2. Check if user is authorized to update proposal
        if (proposal.talentId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        //3. Check order status
        const order = await Order.findById(proposal.orderId)
        if (order.status !== "pending" && order.status !== "approved")
            throw new BadRequestError(
                "Bạn không thể cập nhật hợp đồng ở bước này"
            )

        //4. Update proposal
        const updatedProposal = await Proposal.findByIdAndUpdate(
            proposalId,
            {
                $set: body,
            },
            { new: true }
        )
        await proposal.save()
        return {
            proposal: updatedProposal,
        }
    }

    static deleteProposal = async (userId, proposalId) => {
        //1. Check proposal, user exists
        const proposal = await Proposal.findById(proposalId)
        const user = await User.findById(userId)
        if (!proposal) throw new NotFoundError("Không tìm thấy hợp đồng")
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Check if user is authorized to delete proposal
        if (proposal.talentId.toString() !== userId)
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");
        if(!user.taxCode || !user.taxCode.code || user.taxCode.isVerified === false)
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này");

        //3. Check status of order
        const order = await Order.findById(proposal.orderId)
        if (order.status !== "pending" && order.status !== "approved")
            throw new BadRequestError("Bạn không thể cập nhật hợp đồng ở bước này")

        //4. Delete proposal
        await proposal.deleteOne()

        return {
            proposal,
        }
    }

    static generatePaymentUrl = async (userId, proposalId) => {
        //1. Check if user exists
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        //2. Check if proposal exists
        const proposal = await Proposal.findById(proposalId)
        if (!proposal) throw new NotFoundError("Không tìm thấy hợp đồng")

        //3. Check if order exists and is approved
        const order = await Order.findById(proposal.orderId)
        if (!order) throw new NotFoundError("Không tìm thấy dịch vụ")
        if (order.memberId.toString() !== userId) throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")
        if (order.status !== 'approved') throw new BadRequestError('Đơn hàng này chưa có hợp đồng')

        //4. Create payment with MoMo
        const amount = proposal.price
        const requestType = 'payWithMethod'
        const paymentData = await MomoService.generatePaymentData(amount, requestType)

        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(
                    JSON.stringify(paymentData)
                ),
            },
            data: JSON.stringify(paymentData),
        }

        let paymentResponse
        try {
            paymentResponse = await axios(options)
        } catch (error) {
            console.log("Error generating payment URL: ", error)
            throw new BadRequestError("Error generating payment URL")
        }

        //5. Update order with MoMo order id
        order.momoOrderId = paymentResponse.data.orderId
        await order.save()

        return {
            paymentData,
            paymentResponse: paymentResponse.data,
        }
    }

    static momoCallback = async (body) => {
        //Confirm order
        const order = await Order.findOne({ momoOrderId: body.orderId })
        if (body.resultCode == 0) {
            order.status = "confirmed"
            await order.save()
        }

        //Send email to talent, user
        return {
            order,
            body,
        }
    }

    static readMomoOrderStatus = async (body) => {
        const { momoOrderId } = body

        const rawSignature = `accessKey=${accessKey}&orderId=${momoOrderId}&partnerCode=MOMO&requestId=${momoOrderId}`

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex")

        const requestBody = {
            partnerCode: "MOMO",
            requestId: momoOrderId,
            orderId: momoOrderId,
            signature,
            lang: "vi",
        }

        //options for axios
        const options = {
            hostname: "test-payment.momo.vn",
            port: 443,
            path: "/v2/gateway/api/query",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: requestBody,
        }

        let result = await axios(options)

        return {
            result: result.data,
        }
    }

    static bindPaymentAccount = async(userId, body) => {
        //1. Check if user exists
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError('User not found')

        //2. Bind payment account
        const amount = 0
        const requestType = 'linkWallet'
        const paymentData = await MomoService.generatePaymentData(amount, requestType)

        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(
                    JSON.stringify(paymentData)
                ),
            },
            data: JSON.stringify(paymentData),
        }

        let paymentResponse
        try {
            paymentResponse = await axios(options)
            console.log(paymentResponse);
        } catch (error) {
            console.log("Error generating payment URL: ", error)
            throw new BadRequestError("Error generating payment URL")
        }

        return {
            paymentResponse: paymentResponse.data,
        }
    }

    static confirmProposal = async (userId, proposalId) => {
        // 1. Check if user exists
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')

        // 2. Check if proposal exists
        const proposal = await Proposal.findById(proposalId)
        if (!proposal) throw new NotFoundError('Không tìm thấy hợp đồng')

        // 3. Check if talent exists
        const talent = await User.findById(proposal.talentId)
        if (!talent) throw new NotFoundError('Talent not found')

        // 4. Check if order exists and is approved
        const order = await Order.findById(proposal.orderId)
        if (!order) throw new NotFoundError('Không tìm thấy dịch vụ')
        if (order.status !== 'approved') throw new BadRequestError('Order is not approved')

        // 5. Create payment with MoMo
        const amount = proposal.price
        const paymentData = await MomoService.generatePaymentData(amount)
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(paymentData))
            }
        }

        const paymentResponse = await new Promise((resolve, reject) => {
            const apiReq = https.request(options, apiRes => {
                let data = ''
                apiRes.on('data', chunk => { data += chunk })
                apiRes.on('end', () => { resolve(JSON.parse(data)) })
            })

            apiReq.on('error', error => { reject(`Error: ${error.message}`) })
            apiReq.write(JSON.stringify(paymentData))
            apiReq.end()
        })

        // 6. Confirm proposal
        order.status = 'confirmed'
        if (!order.isDirect) {
            order.talentChosenId = proposal.talentId
        }
        await order.save()

        // // 7. Send email to talent
        // try {
        //     await sendAnnouncementEmail(talent.email, 'Proposal confirmed', 'Your proposal has been confirmed by client')
        // } catch (error) {
        //     throw new Error('Email service error')
        // }

        return {
            proposal
        }

        // return {
        //     // paymentData: paymentResponse,
        //     // paymentResponse: paymentResponse
        // }
    }
}

export default ProposalService
