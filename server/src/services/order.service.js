import Order from "../models/order.model.js"
import Artwork from "../models/artwork.model.js"
import Proposal from "../models/proposal.model.js"
import commissionService from "../models/commissionService.model.js"
import { User } from "../models/user.model.js"
import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import { compressAndUploadImage, extractPublicIdFromUrl, deleteFileByPublicId } from "../utils/cloud.util.js"

class OrderService{
    //Order CRUD
    static createOrder = async(userId, req) => {
        //1. Get type and talentChosenId
        const body = req.body
        const {isDirect, talentChosenId, commissionServiceId} = body

        //2. Check isDirect of order
        if(!isDirect){
            //inDirect order
            body.isDirect = false
            body.talentChosenId = null
        }else if(isDirect){
            //direct order
            const talent = await User.findById(talentChosenId)
            const service = await commissionService.findById(commissionServiceId)

            if(!talent) throw new BadRequestError('Talent not found!')
            if(!service) throw new BadRequestError('commissionService not found!')
            if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
            if(talent._id == userId) throw new BadRequestError('You cannot choose yourself!')
            body.isDirect = true
            body.talentChosenId = talentChosenId
            body.commissionServiceId = commissionServiceId
        }else{
            throw new BadRequestError('Type must be direct or inDirect!')
        }
        
        //3. Upload req.files.files to cloudinary
        try {
            let references = []
            
            if (req.files && req.files.files && req.files.files.length > 0) {
                const uploadPromises = req.files.files.map(file => compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/order/${userId}`,
                    width: 1920,
                    height: 1080
                }))
                const uploadResults = await Promise.all(uploadPromises)
                references = uploadResults.map(result => result.secure_url)
            }
        
            //4. Create order
            const order = new Order({
                memberId: userId,
                references,
                ...body
            })
            await order.save()
        
            return {
                order
            }
        } catch (error) {
            console.log('Error uploading images or saving order:', error)
            throw new Error('File upload or database save failed')
        }        
    }

    static readOrder = async(orderId) => {
        const order = await Order.findById(orderId).populate('talentChosenId', 'stageName avatar')
        if (!order) throw new NotFoundError('Order not found!')

        return {
            order
        }
    }
    
    //Client read approved indirect orders in commission market
    static readOrders = async(req) => {
        const q = req.query
        const filters = {
            ...(q.isDirect && { isDirect: q.isDirect}),
        }

        //1. Get all orders
        const orders = await Order.find(filters)
            .populate('talentChosenId', 'stageName avatar')
        //2. Iterate over each order to add talentsApprovedCount
        const ordersWithCounts = await Promise.all(orders.map(async (order) => {
            const talentsApprovedCount = await Proposal.find({ orderId: order._id, status: 'approved' }).countDocuments()
            order._doc.talentsApprovedCount = talentsApprovedCount  // Add the count to the order
            return order
        }))
    
        return {
            orders: ordersWithCounts
        }
    }

    static updateOrder = async(userId, orderId, req) => {
        //1. check order and user
        const oldOrder = await Order.findById(orderId)
        const foundUser = await User.findById(userId)
        if(!foundUser) throw new NotFoundError('User not found!')
        if(!oldOrder) throw new NotFoundError('Order not found!')
        if(oldOrder.memberId.toString() !== userId) throw new AuthFailureError("You can update only your order")

        //2. Check order status
        if(oldOrder.status != 'pending')
            throw new BadRequestError('You cannot update order on this stage!')
        try {
            //3. Handle file uploads if new files were uploaded
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload new files to Cloudinary
                const uploadPromises = req.files.files.map(file => compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/order/${userId}`,
                    width: 1920,
                    height: 1080
                }))
                const uploadResults = await Promise.all(uploadPromises)
                const references = uploadResults.map(result => result.secure_url)
                req.body.references = references

                //Delete old images from cloudinary
                const publicIds = oldOrder.references.map(reference => extractPublicIdFromUrl(reference))
                await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)))
            }

            //4. Merge existing service fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = { ...oldOrder.toObject(), ...req.body }

            //5. update Order
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                updatedFields,
                { new: true }
            )
    
            return {
                order: updatedOrder
            }
        } catch (error) {
            console.log('Error in updating commission service:', error)
            throw new Error('Service update failed')
        }
    }

    static deleteOrder = async(userId, orderId) => {
        //1. Check user and order
        const foundUser = await User.findById(userId)
        const order = await Order.findById(orderId)
        if(!foundUser) throw new NotFoundError('User not found!')
        if(!order) throw new NotFoundError('Order not found!')
        if(foundUser._id != order.memberId.toString()) throw new AuthFailureError('You can delete only your order!')
        
        //2. Check order status
        if(oldOrder.status != 'pending' && oldOrder.status != 'approved')
            throw new BadRequestError('You cannot delete order on this stage!')

        //3. Extract public IDs and delete files from Cloudinary
        const publicIds = order.references.map(reference => extractPublicIdFromUrl(reference))
        await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)))

        //4. Delete order
        await order.deleteOne()

        return{
            message: 'Order deleted successfully!'
        }
    }
    //End Order CRUD

    static readOrderHistory = async (clientId) => {
        //1. Check user
        const foundUser = await User.findById(clientId)
        if(!foundUser) throw new NotFoundError('User not found!')
        
        //2. Get orders
        const orders = await Order.find({ memberId: clientId })
            .populate('talentChosenId', 'stageName avatar')

        return {
            orders
        }
    }

    // static chooseProposal = async(userId, orderId, proposalId) => {
    //     //1. Check user, order and proposal
    //     const user = await User.findById(userId)
    //     const updatedOrder = await Order.findById(orderId)
    //     const proposal = await Proposal.findById(proposalId)

    //     if(!user) throw new NotFoundError('User not found!')
    //     if(!updatedOrder) throw new NotFoundError('Order not found!')
    //     if(!proposal) throw new BadRequestError('Proposal not found!')

    //     //2. Further checking
    //     if(user._id != updatedOrder.memberId.toString()) throw new AuthFailureError('You can choose talent only for your Order!')
    //     if(proposal.orderId.toString() != updatedOrder._id.toString()) throw new BadRequestError('Proposal does not belong to this order!')
    //     if(updatedOrder.talentChosenId) throw new BadRequestError('You have already chosen a talent!')

    //     //3. Choose proposal
    //     updatedOrder.status = 'confirmed'
    //     updatedOrder.talentChosenId = proposal.talentId
    //     updatedOrder.save()

    //     return {
    //         order: updatedOrder
    //     }
    // }

    static denyOrder = async(userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if(!user) throw new NotFoundError('User not found')
        if(!order) throw new NotFoundError('Order not found')

        //2. Check if user is authorized to deny order
        if(user.role !== 'talent')
            throw new AuthFailureError('You are not authorized to deny this order')

        //3. Check if order status is pending
        if(order.status !== 'pending')
            throw new BadRequestError('You cannot deny this order')

        //4. Deny order
        order.status = 'rejected'
        order.save()

        //5. Show order
        const showOrder = order.populate('talentChosenId', 'stageName avatar')

        //6. Send email to user
        // try {
        //     await sendEmail(user.email, 'Order rejected', 'Your order has been rejected by talent')
        // } catch (error) {
        //     throw new Error('Email service error')
        // }
        
        return {
            order: showOrder
        }
    }
}

export default OrderService