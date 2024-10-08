import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import accessService from '../../services/auth.service.js'
import badgeController from '../../controllers/badge.controller.js'
import { uploadFields, uploadMemory } from '../../configs/multer.config.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.get('/readEarlyBirdBadge', asyncHandler(badgeController.readEarlyBirdBadge))
router.get('/readTrustedArtistBadge', asyncHandler(badgeController.readTrustedArtistBadge))
router.get('/readPlatformAmbassadorBadge', asyncHandler(badgeController.readPlatformAmbassadorBadge))

//admin
router.post('/createBadge', uploadMemory.single('file'), accessService.grantAccess('createAny', 'profile'), asyncHandler(badgeController.createBadge))
router.patch('/updateBadge/:badgeId', uploadMemory.single('file'), accessService.grantAccess('updateAny', 'profile'), asyncHandler(badgeController.updateBadge))
router.delete('/deleteBadge/:badgeId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(badgeController.deleteBadge))

//Award badge
router.patch('/awardEarlyBirdBadge', asyncHandler(badgeController.awardEarlyBirdBadge))
router.patch('/awardTrustedArtistBadge', asyncHandler(badgeController.awardTrustedArtistBadge))
router.patch('/awardPlatformAmbassadorBadge', asyncHandler(badgeController.awardPlatformAmbassadorBadge))


export default router
