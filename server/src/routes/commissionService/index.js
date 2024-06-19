import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js";
import commissionServiceController from '../../controllers/commissionService.controller.js';

const router = express.Router()

router.get('/readCommissionService/:commissionServiceId', asyncHandler(commissionServiceController.readCommissionService))
router.get('/readCommissionServices/:talentId', asyncHandler(commissionServiceController.readCommissionServices))

//authentication
router.use(verifyToken)

router.post('/createCommissionService', asyncHandler(commissionServiceController.createCommissionService))
router.patch('/updateCommissionService/:commissionServiceId', asyncHandler(commissionServiceController.updateCommissionService))
router.delete('/deleteCommissionService/:commissionServiceId', asyncHandler(commissionServiceController.deleteCommissionService))

export default router
