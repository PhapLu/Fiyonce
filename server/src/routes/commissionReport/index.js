import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js";
import commissionReportController from '../../controllers/commissionReport.controller.js';
import { uploadFields } from '../../configs/multer.config.js';

const router = express.Router()

router.get('/readCommissionReport/:commissionReportId', asyncHandler(commissionReportController.readCommissionReport))

//authentication
router.use(verifyToken)

router.post('/createCommissionReport', uploadFields, asyncHandler(commissionReportController.createCommissionReport))
router.get('/readCommissionReports/:talentId', accessService.grantAccess('readAny', 'profile'), asyncHandler(commissionReportController.readCommissionReports))
router.patch('/updateCommissionReport/:commissionReportId', uploadFields, asyncHandler(commissionReportController.updateCommissionReport))
router.delete('/deleteCommissionReport/:commissionReportId', asyncHandler(commissionReportController.deleteCommissionReport))

export default router
