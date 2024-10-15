import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import transactionDashboardController from '../../controllers/transactionDashboard.controller.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.get('/readTransactionOverview', accessService.grantAccess('readAny', 'profile'), asyncHandler(transactionDashboardController.readTransactionOverview))
router.get('/calculateIncomeOverview', accessService.grantAccess('readAny', 'profile'), asyncHandler(transactionDashboardController.calculateIncomeOverview))

export default router
