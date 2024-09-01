import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import accessService from '../../services/auth.service.js'
import badgeController from '../../controllers/badge.controller.js'
import { uploadFields, uploadMemory } from '../../configs/multer.config.js'

const router = express.Router()

router.get('/readBadges', asyncHandler(badgeController.readBadges))

//authentication
router.use(verifyToken)

//admin
router.post('/createBadge', uploadMemory.single('file'), accessService.grantAccess('createAny', 'profile'), asyncHandler(badgeController.createBadge))
router.patch('/updateBadge/:badgeId', uploadFields, accessService.grantAccess('updateAny', 'profile'), asyncHandler(badgeController.updateBadge))
router.delete('/deleteBadge/:badgeId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(badgeController.deleteBadge))

//Award badge
router.patch('/awardEarlyBirdBadge/:userId', accessService.grantAccess('updateAny', 'profile'), asyncHandler(badgeController.awardEarlyBirdBadge))
export default router
