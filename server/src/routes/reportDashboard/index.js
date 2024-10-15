import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import ReportDashboardController from '../../controllers/reportDashboard.controller.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.get('/readReportOverview', accessService.grantAccess('readAny', 'profile'), asyncHandler(ReportDashboardController.readReportOverview))

export default router
