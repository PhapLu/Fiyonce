import { SuccessResponse } from "../core/success.response.js"
import OrderService from "../services/order.service.js"

class OrderController {
    //Order CRUD
    createOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create order success!',
            metadata: await OrderService.createOrder(req.userId, req)
        }).send(res)
    }

    readOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Read a order',
            metadata: await OrderService.readOrder(req.params.orderId)
        }).send(res)
    }

    readOrders = async (req, res, next) => {
        new SuccessResponse({
            message: 'Read all orders',
            metadata: await OrderService.readOrders(req)
        }).send(res)
    }

    updateOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update order successfully!',
            metadata: await OrderService.updateOrder(req.userId, req.params.orderId, req)
        }).send(res)
    }

    deleteOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete order successfully!',
            metadata: await OrderService.deleteOrder(req.userId, req.params.orderId)
        }).send(res)
    }

    archiveOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Archive order successfully!',
            metadata: await OrderService.archiveOrder(req.userId, req.params.orderId)
        }).send(res)
    }


    unarchiveOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Archive order successfully!',
            metadata: await OrderService.unarchiveOrder(req.userId, req.params.orderId)
        }).send(res)
    }

    //End Order CRUD
    readMemberOrderHistory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Read all orders of a client',
            metadata: await OrderService.readMemberOrderHistory(req.userId)
        }).send(res)
    }

    readTalentOrderHistory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Read all orders of a client',
            metadata: await OrderService.readTalentOrderHistory(req.userId)
        }).send(res)
    }

    readArchivedOrderHistory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Read all orders of a client',
            metadata: await OrderService.readArchivedOrderHistory(req.userId)
        }).send(res)
    }

    chooseProposal = async (req, res, next) => {
        new SuccessResponse({
            message: 'Choose talent success!',
            metadata: await OrderService.chooseProposal(req.userId, req.params.orderId, req.body.proposalId)
        }).send(res)
    }

    rejectOrder = async (req, res, next) => {
        console.log(req.body)
        new SuccessResponse({
            message: 'Deny the order success!',
            metadata: await OrderService.rejectOrder(req.userId, req.params.orderId, req.body)
        }).send(res)
    }
    
    startWipCommissionOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Start WIP commission order success!',
            metadata: await OrderService.startWipCommissionOrder(req.userId, req.params.orderId)
        }).send(res)
    }

    deliverOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deliver order success!',
            metadata: await OrderService.deliverOrder(req.userId, req.params.orderId, req)
        }).send(res)
    }

    finishOrder = async (req, res, next) => {
        new SuccessResponse({
            message: 'Finish order success!',
            metadata: await OrderService.finishOrder(req.userId, req.params.orderId)
        }).send(res)
    }
}

export default new OrderController()