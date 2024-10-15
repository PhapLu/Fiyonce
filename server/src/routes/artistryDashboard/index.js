import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import artistryDashboardController from '../../controllers/artistryDashboard.controller.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.get('/readBadgeOverview', accessService.grantAccess('readAny', 'profile'), asyncHandler(artistryDashboardController.readBadgeOverview))
router.get('/readBadgeAchievedOverview', accessService.grantAccess('readAny', 'profile'), asyncHandler(artistryDashboardController.readBadgeAchievedOverview))
router.get('/readChallengeOverview', accessService.grantAccess('readAny', 'profile'), asyncHandler(artistryDashboardController.readChallengeOverview))
router.get('/readChallengeTotalVotes', accessService.grantAccess('readAny', 'profile'), asyncHandler(artistryDashboardController.readChallengeTotalVotes))

export default router
