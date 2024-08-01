import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import { uploadFields } from '../../configs/multer.config.js'
import submissionController from '../../controllers/submission.controller.js'

const router = express.Router()
router.get('/readSubmission/:submissionId', accessService.grantAccess('readAny', 'profile'), asyncHandler(submissionController.readSubmission))
router.get('/readSubmissions', accessService.grantAccess('readAny', 'profile'), asyncHandler(submissionController.readSubmissions))

//authentication
router.use(verifyToken)

router.post('/createSubmission/:challengeId', uploadFields, asyncHandler(submissionController.createSubmission))
router.patch('/updateSubmission/:submissionId', uploadFields, asyncHandler(submissionController.updateSubmission))

export default router
