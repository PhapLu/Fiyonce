import express from 'express'
import { verifyToken } from "../../middlewares/jwt.js";
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { uploadFields } from '../../configs/multer.config.js';
import accessService from '../../services/auth.service.js'
import commissionReportController from '../../controllers/commissionReport.controller.js';

const router = express.Router()

router.get('/readCommissionReport/:commissionReportId', asyncHandler(commissionReportController.readCommissionReport))

//authentication
router.use(verifyToken)

router.post('/createCommissionReport', uploadFields, asyncHandler(commissionReportController.createCommissionReport))
router.patch('/updateCommissionReport/:commissionReportId', uploadFields, asyncHandler(commissionReportController.updateCommissionReport))
router.delete('/deleteCommissionReport/:commissionReportId', asyncHandler(commissionReportController.deleteCommissionReport))

//admin
router.get('/readCommissionReports', accessService.grantAccess('readAny', 'profile'), asyncHandler(commissionReportController.readCommissionReports))
router.patch('/adminReceiveReport/:commissionReportId', accessService.grantAccess('updateAny', 'profile'), asyncHandler(commissionReportController.adminReceiveReport))
router.patch('/adminMakeDecision/:commissionReportId', accessService.grantAccess('updateAny', 'profile'), asyncHandler(commissionReportController.adminMakeDecision))

export default router
