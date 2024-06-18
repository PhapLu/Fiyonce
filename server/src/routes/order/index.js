import express from "express";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import orderController from "../../controllers/order.controller.js";
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()

router.get('/readOrder/:orderId', asyncHandler(orderController.readOrder))
router.get('/readOrders', asyncHandler(orderController.readOrders))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)

//CRUD
router.post('/createOrder', asyncHandler(orderController.createOrder))
router.patch('/updateOrder/:orderId', asyncHandler(orderController.updateOrder))
router.delete('/deleteOrder/:orderId', asyncHandler(orderController.deleteOrder))
//END CRUD

router.get('/viewOrderHistory', asyncHandler(orderController.viewOrderHistory))
router.patch('/chooseProposal/:orderId', asyncHandler(orderController.chooseProposal))
router.patch('/denyOrder/:orderId', asyncHandler(orderController.denyOrder))

export default router