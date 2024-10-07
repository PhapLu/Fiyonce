import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import reviewController from '../../controllers/review.controller.js'

const router = express.Router()

router.get('/readReviews/:userId',asyncHandler(reviewController.readReviews))
router.get('/readReviewsOrderId/:orderId',asyncHandler(reviewController.readReviewsOrderId))

//authentication
router.use(verifyToken)

router.patch('/createReview/:orderId', asyncHandler(reviewController.createReview))

export default router
