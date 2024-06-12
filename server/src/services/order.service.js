import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import Order from "../models/order.model.js"
import { User } from "../models/user.model.js"
import {artwork} from "../models/artwork.model.js"

class OrderService{
    //Order CRUD
    static createOrder = async(userId, body) => {
        const {type, talentChosenId} = body
        if(type == 'toMarket'){
            body.toMarket = true
            body.talentChosenId = null
        }else if(type == 'toTalent'){
            const talent = await User.findById(talentChosenId)
            if(!talent) throw new BadRequestError('Talent not found!')
            if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
            body.toMarket = false
            body.talentChosenId = talentChosenId
        }
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
        const order = await Order.findById(orderId)
        if(!order) throw new NotFoundError('Order not found!')
        return {
            order
        }
    }
    
    static readOrders = async() => {
        const orders = await Order.find({toMarket: true})
        return {
            orders
        }
    }

    static updateOrder = async(userId, orderId, body) => {
        //1. check order and user
        const oldOrder = await Order.findById(orderId)
        const foundUser = await User.findById(userId)
        if(!foundUser) throw new NotFoundError('User not found!')
        if(!oldOrder) throw new NotFoundError('Order not found!')
        if(oldOrder.memberId.toString() != userId) throw new AuthFailureError("You can update only your order")
        
        //2. update Order
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
        
        //2. Delete order
        return await Order.findByIdAndDelete(orderId)
    }
    //End Order CRUD

    static viewOrderHistory = async (clientId) => {
        //1. Check user
        const foundUser = await User.findById(clientId)
        if(!foundUser) throw new NotFoundError('User not found!')
        
        //2. Get orders
        const orders = await Order.find({ memberId: clientId });
        return {
            orders
        };
    }

    static chooseTalent = async(userId, orderId, talentId) => {
        //1. Check user, order and talent
        const user = await User.findById(userId)
        const updatedOrder = await Order.findById(orderId)
        const talent = await User.findById(talentId)

        if(!user) throw new NotFoundError('User not found!')
        if(!updatedOrder) throw new NotFoundError('Order not found!')
        if(!talent) throw new BadRequestError('Talent not found!')
        if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
        if(user._id != updatedOrder.memberId.toString()) throw new AuthFailureError('You can choose talent only in your Order!')
        if(updatedOrder.talentChosenId) throw new BadRequestError('You have already chosen a talent!')
        if(talentId != updatedOrder.talentsAccepted.find(talent => talent == talentId)) throw new BadRequestError('You can choose only accepted talent!')

        //2 Choose talent
        updatedOrder.talentChosenId = talentId
        updatedOrder.save()

        return {
            order: updatedOrder
        }
    }
}

export default OrderService