import { SuccessResponse } from "../core/success.response.js"
import OrderService from "../services/order.service.js"

class OrderController{
    //Order CRUD
    createOrder = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tạo đơn hàng thành công',
            metadata: await OrderService.createOrder(req.userId, req)
        }).send(res)
    }

    readOrder = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Xem đơn hàng thành công',
            metadata: await OrderService.readOrder(req.params.orderId)
        }).send(res)
    }

    readOrders = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Xem các đơn hàng thành công',
            metadata: await OrderService.readOrders(req) 
        }).send(res)
    }

    updateOrder = async(req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật đơn hàng thành công',
            metadata: await OrderService.updateOrder(req.userId, req.params.orderId, req)
        }).send(res)
    }

    archiveOrder = async(req, res, next) => {
        new SuccessResponse({
            message: 'Lưu trữ đơn hàng thành công',
            metadata: await OrderService.archiveOrder(req.userId, req.params.orderId)
        }).send(res)
    }

    
    unarchiveOrder = async(req, res, next) => {
        new SuccessResponse({
            message: 'Hủy lưu trữ đơn hàng thành công',
            metadata: await OrderService.unarchiveOrder(req.userId, req.params.orderId)
        }).send(res)
    }
   
    //End Order CRUD
    readMemberOrderHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Xem toàn bộ đơn hàng thành công',
            metadata: await OrderService.readMemberOrderHistory(req.userId)
        }).send(res)
    }

    readTalentOrderHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Xem toàn bộ đơn hàng thành công',
            metadata: await OrderService.readTalentOrderHistory(req.userId)
        }).send(res)
    }

    readArchivedOrderHistory = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Xem toàn bộ đơn hàng đã lưu trữ thành công',
            metadata: await OrderService.readArchivedOrderHistory(req.userId)
        }).send(res)
    }

    rejectOrder = async (req, res, next) => {
        console.log(req.body)
        new SuccessResponse({
            message: 'Đã từ chối hợp đồng',
            metadata: await OrderService.rejectOrder(req.userId, req.params.orderId, req.body)
        }).send(res)
    }
}

export default new OrderController()