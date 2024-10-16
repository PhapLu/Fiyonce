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
            metadata: await ReviewService.readReviews(req.params.commissionServiceId)
        }).send(res)
    }

    readReview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read reviews success!',
            metadata: await ReviewService.readReview(req.params.orderId)
        }).send(res)
    }
    
    updateReview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update review success!',
            metadata: await ReviewService.updateReview(req.userId, req.params.orderId, req.body)
        }).send(res)
    }

    deleteReview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete review success!',
            metadata: await ReviewService.deleteReview(req.userId, req.params.orderId)
        }).send(res)
    }

}

export default new ReviewController()