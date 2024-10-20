import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import { uploadFields } from '../../configs/multer.config.js'
import talentRequestController from '../../controllers/talentRequest.controller.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.post('/requestUpgradingToTalent', uploadFields, asyncHandler(talentRequestController.requestUpgradingToTalent))
router.get('/readTalentRequestStatus/', asyncHandler(talentRequestController.readTalentRequestStatus))

//admin
router.patch('/upgradeRoleToTalent/:requestId', accessService.grantAccess('updateAny', 'profile'), asyncHandler(talentRequestController.upgradeRoleToTalent))
router.patch('/denyTalentRequest/:requestId', accessService.grantAccess('updateAny', 'profile'), asyncHandler(talentRequestController.denyTalentRequest))
router.get('/readTalentRequest/:requestId', accessService.grantAccess('readAny', 'profile'), asyncHandler(talentRequestController.readTalentRequest))
router.get('/readTalentRequestsByStatus/:status', accessService.grantAccess('readAny', 'profile'), asyncHandler(talentRequestController.readTalentRequestsByStatus))

export default router
