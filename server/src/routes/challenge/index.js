import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import accessService from '../../services/auth.service.js'
import challengeController from '../../controllers/challenge.controller.js'
import { uploadFields } from '../../configs/multer.config.js'

const router = express.Router()

router.get('/readChallenge/:challengeId', asyncHandler(challengeController.readChallenge))
router.get('/readChallenges', asyncHandler(challengeController.readChallenges))

//authentication
router.use(verifyToken)

//admin
router.post('/createChallenge', uploadFields, accessService.grantAccess('createAny', 'profile'), asyncHandler(challengeController.createChallenge))
router.patch('/updateChallenge/:challengeId', uploadFields, accessService.grantAccess('updateAny', 'profile'), asyncHandler(challengeController.updateChallenge))
router.delete('/deleteChallenge/:challengeId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(challengeController.deleteChallenge))

export default router
