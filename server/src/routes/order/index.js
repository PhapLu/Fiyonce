import express from "express"
import { asyncHandler } from "../../auth/checkAuth.js"
import { authenticationV2 } from "../../auth/authUtils.js"
import orderController from "../../controllers/order.controller.js"
import { verifyToken } from "../../middlewares/jwt.js"
import { uploadFields } from "../../configs/multer.config.js"

const router = express.Router()

router.get('/readOrder/:orderId', asyncHandler(orderController.readOrder))
router.get('/readOrders', asyncHandler(orderController.readOrders))

//authentication
router.use(verifyToken)

//CRUD
router.post('/createOrder', uploadFields, asyncHandler(orderController.createOrder))
router.patch('/updateOrder/:orderId', uploadFields, asyncHandler(orderController.updateOrder))
router.patch('/archiveOrder/:orderId', asyncHandler(orderController.archiveOrder))
router.patch('/unarchiveOrder/:orderId', asyncHandler(orderController.unarchiveOrder))

//END CRUD

router.get('/readMemberOrderHistory', asyncHandler(orderController.readMemberOrderHistory))
router.get('/readTalentOrderHistory', asyncHandler(orderController.readTalentOrderHistory))
router.get('/readArchivedOrderHistory', asyncHandler(orderController.readArchivedOrderHistory))
router.patch('/chooseProposal/:orderId', asyncHandler(orderController.chooseProposal))
router.patch('/cancelOrder/:orderId', asyncHandler(orderController.cancelOrder))
router.patch('/rejectOrder/:orderId', asyncHandler(orderController.rejectOrder))
router.patch('/startWipCommissionOrder/:orderId', asyncHandler(orderController.startWipCommissionOrder))

export default router