import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import Order from "../models/order.model.js"
import { User } from "../models/user.model.js"
import {artwork} from "../models/artwork.model.js"
import Proposal from "../models/proposal.model.js"

class OrderService{
    //Order CRUD
    static createOrder = async(userId, body) => {
        //1. Get type and talentChosenId
        const {type, talentChosenId} = body

        //2. Check type of order
        if(type == 'inDirect'){
            //inDirect order
            body.isDirect = false
            body.talentChosenId = null
        }else if(type == 'direct'){
            //direct order
            const talent = await User.findById(talentChosenId)
            if(!talent) throw new BadRequestError('Talent not found!')
            if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
            if(talent._id == userId) throw new BadRequestError('You cannot choose yourself!')
            body.isDirect = true
            body.talentChosenId = talentChosenId
        }else{
            throw new BadRequestError('Type must be direct or inDirect!')
        }

        //3. Create order
        const order = new Order({
            memberId: userId,
            ...body
        })
        await order.save()
        return {
            order
        }
    }

    static readOrder = async(orderId) => {
        console.log(orderId)
        const order = await Order.findById(orderId).populate('talentChosenId', 'stageName avatar')
        console.log(order)
        if (!order) throw new NotFoundError('Order not found!')
        return {
            order
        };
    };
    
    static readOrders = async() => {
        //1. Get all orders
        const orders = await Order.find({ isDirect: false })
            .populate('talentChosenId', 'stageName avatar');
        //2. Iterate over each order to add talentsAcceptedCount
        const ordersWithCounts = await Promise.all(orders.map(async (order) => {
            const talentsAcceptedCount = await Proposal.find({ orderId: order._id, status: 'accepted' }).countDocuments();
            order._doc.talentsAcceptedCount = talentsAcceptedCount;  // Add the count to the order
            return order;
        }));
    
        return {
            orders: ordersWithCounts
        };
    };

    static updateOrder = async(userId, orderId, body) => {
        //1. check order and user
        const oldOrder = await Order.findById(orderId)
        const foundUser = await User.findById(userId)
        if(!foundUser) throw new NotFoundError('User not found!')
        if(!oldOrder) throw new NotFoundError('Order not found!')
        if(oldOrder.memberId.toString() !== userId) throw new AuthFailureError("You can update only your order")

        //2. Check order status
        if(oldOrder.status != 'pending')
            throw new BadRequestError('You cannot update order on this stage!')
        
        //3. update Order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: body
            },
            { new: true }
        )
        return {
            order: updatedOrder
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
        if(oldOrder.status != 'pending' && oldOrder.status != 'accepted')
            throw new BadRequestError('You cannot delete order on this stage!')

        //3. Delete order
        return await Order.findByIdAndDelete(orderId)
    }
    //End Order CRUD

    static viewOrderHistory = async (clientId) => {
        //1. Check user
        const foundUser = await User.findById(clientId)
        if(!foundUser) throw new NotFoundError('User not found!')
        
        //2. Get orders
        const orders = await Order.find({ memberId: clientId })
            .populate('talentChosenId', 'stageName avatar');
        return {
            orders
        };
    }

    static chooseProposal = async(userId, orderId, proposalId) => {
        //1. Check user, order and proposal
        const user = await User.findById(userId)
        const updatedOrder = await Order.findById(orderId)
        const proposal = await Proposal.findById(proposalId)

        if(!user) throw new NotFoundError('User not found!')
        if(!updatedOrder) throw new NotFoundError('Order not found!')
        if(!proposal) throw new BadRequestError('Proposal not found!')

        //2. Further checking
        if(user._id != updatedOrder.memberId.toString()) throw new AuthFailureError('You can choose talent only for your Order!')
        if(proposal.orderId.toString() != updatedOrder._id.toString()) throw new BadRequestError('Proposal does not belong to this order!')
        if(updatedOrder.talentChosenId) throw new BadRequestError('You have already chosen a talent!')

        //3. Choose proposal
        updatedOrder.status = 'confirmed'
        updatedOrder.talentChosenId = proposal.talentId
        updatedOrder.save()

        return {
            order: updatedOrder
        }
    }
}

export default OrderService