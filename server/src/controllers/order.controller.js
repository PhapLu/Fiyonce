import { SuccessResponse } from "../core/success.response.js"
import OrderService from "../services/order.service.js"

class OrderController{
    //Order CRUD
    createOrder = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create order success!',
            metadata: await OrderService.createOrder(req.userId, req)
        }).send(res)
    }

    readOrder = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read a order',
            metadata: await OrderService.readOrder(req.params.orderId)
        }).send(res)
    }

    readOrders = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all orders',
            metadata: await OrderService.readOrders(req) 
        }).send(res)
    }

    updateOrder = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update order successfully!',
            metadata: await OrderService.updateOrder(req.userId, req.params.orderId, req.body)
        }).send(res)
    }

    deleteOrder = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete a order successfully!',
            metadata: await OrderService.deleteOrder(req.userId, req.params.orderId)
        }).send(res)
    }

    //End Order CRUD
    readOrderHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Read all orders of a client',
            metadata: await OrderService.readOrderHistory(req.userId)
        }).send(res)
    }

    chooseProposal = async (req, res, next) => {
        new SuccessResponse({
            message: 'Choose talent success!',
            metadata: await OrderService.chooseProposal(req.userId, req.params.orderId, req.body.proposalId)
        }).send(res)
    }

    denyOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deny the order success!',
            metadata: await OrderService.denyOrder(req.userId, req.params.orderId)
        }).send(res)
    }
}

export default new OrderController()