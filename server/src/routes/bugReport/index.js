import express from 'express'
import { verifyToken } from "../../middlewares/jwt.js";
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { uploadFields } from '../../configs/multer.config.js';
import accessService from '../../services/auth.service.js'
import bugReportController from '../../controllers/bugReport.controller.js';

const router = express.Router()

router.get('/readBugReport/:bugReportId', asyncHandler(bugReportController.readBugReport))

//authentication
router.use(verifyToken)

router.post('/createBugReport', uploadFields, asyncHandler(bugReportController.createBugReport))
router.get('/readBugReports', accessService.grantAccess('readAny', 'profile'), asyncHandler(bugReportController.readBugReports))
router.patch('/updateBugReport/:bugReportId', uploadFields, asyncHandler(bugReportController.updateBugReport))
router.delete('/deleteBugReport/:bugReportId', asyncHandler(bugReportController.deleteBugReport))

export default router
