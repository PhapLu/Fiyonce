import { SuccessResponse } from "../core/success.response.js"
import ReviewService from "../services/review.service.js"

class ReviewController{
    createReview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create review success!',
            metadata: await ReviewService.createReview(req.userId, req.params.orderId, req.body)
        }).send(res)
    }

    readReviews = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read reviews success!',
            metadata: await ReviewService.readReviews(req.params.userId)
        }).send(res)
    }

    readReviewsOrderId = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read reviews success!',
            metadata: await ReviewService.readReviewsOrderId(req.params.orderId)
        }).send(res)
    }
}

export default new ReviewController()