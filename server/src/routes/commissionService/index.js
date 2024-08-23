import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js"
import commissionServiceController from '../../controllers/commissionService.controller.js'
import { uploadFields } from '../../configs/multer.config.js'

const router = express.Router()

router.get('/readCommissionService/:commissionServiceId', asyncHandler(commissionServiceController.readCommissionService))
router.get('/readCommissionServices/:talentId', asyncHandler(commissionServiceController.readCommissionServices))
router.get('/readBookmarkedServices/:userId', asyncHandler(commissionServiceController.readBookmarkedServices))

//authentication
router.use(verifyToken)

router.post('/createCommissionService', uploadFields, asyncHandler(commissionServiceController.createCommissionService))
router.patch('/updateCommissionService/:commissionServiceId', uploadFields, asyncHandler(commissionServiceController.updateCommissionService))
router.delete('/deleteCommissionService/:commissionServiceId', asyncHandler(commissionServiceController.deleteCommissionService))
router.patch('/bookmarkCommissionService/:commissionServiceId', asyncHandler(commissionServiceController.bookmarkCommissionService))

export default router
