import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import badgeController from '../../controllers/badge.controller.js'

const router = express.Router()

//authentication
router.use(verifyToken)

router.get('/readBadge/:badgeKey', asyncHandler(badgeController.readBadge))

//Award badge
router.patch('/awardBadge/:badgeKey', asyncHandler(badgeController.awardBadge))


export default router
