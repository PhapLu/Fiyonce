import express from 'express'
import { verifyToken } from "../../middlewares/jwt.js";
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { uploadFields } from '../../configs/multer.config.js';
import accessService from '../../services/auth.service.js'
import accountReportController from '../../controllers/accountReport.controller.js';

const router = express.Router()

router.get('/readAccountReport/:accountReportId', asyncHandler(accountReportController.readAccountReport))

//authentication
router.use(verifyToken)

router.post('/createAccountReport', uploadFields, asyncHandler(accountReportController.createAccountReport))
router.get('/readAccountReports', accessService.grantAccess('readAny', 'profile'), asyncHandler(accountReportController.readAccountReports))
router.patch('/updateAccountReport/:accountReportId', uploadFields, asyncHandler(accountReportController.updateAccountReport))
router.delete('/deleteAccountReport/:accountReportId', asyncHandler(accountReportController.deleteAccountReport))

export default router
