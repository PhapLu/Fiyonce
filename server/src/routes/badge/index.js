import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import badgeController from '../../controllers/badge.controller.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.get('/readEarlyBirdBadge/:badgeKey', asyncHandler(badgeController.readEarlyBirdBadge))
router.get('/readTrustedArtistBadge/:badgeKey', asyncHandler(badgeController.readTrustedArtistBadge))
router.get('/readPlatformAmbassadorBadge/:badgeKey', asyncHandler(badgeController.readPlatformAmbassadorBadge))

//Award badge
router.patch('/awardEarlyBirdBadge/:badgeKey', asyncHandler(badgeController.awardEarlyBirdBadge))
router.patch('/awardTrustedArtistBadge:badgeKey', asyncHandler(badgeController.awardTrustedArtistBadge))
router.patch('/awardPlatformAmbassadorBadge:badgeKey', asyncHandler(badgeController.awardPlatformAmbassadorBadge))


export default router
