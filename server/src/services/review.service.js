import Order from "../models/order.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"

class ReviewService {
    static createReview = async (userId, orderId, body) => {
        //1. Check user, order
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")
        if (order.memberId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        //2. Create review
        const review = {
            userId: userId,
            rating: body.rating,
            comment: body.comment,
        }

        //3. Create review (Update order)
        await Order.findByIdAndUpdate(
            orderId,
            { $set: { review: review } },
            { new: true }
        )

        return {
            review: review,
        }
    }

    static readReview = async (orderId) => {
        // 1. Check order
        const order = await Order.findById(orderId).populate(
            "review.userId",
            "stageName avatar"
        )
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")

        // 2. Return review
        return {
            review: order.review,
        }
    }

    static readReviews = async (commissionServiceId) => {
        //1. Find commission service
        const orders = await Order.find({
            commissionServiceId: commissionServiceId,
        }).populate("review.userId", "stageName avatar")

        //2. Calculate commissionService rating
        let rating = 0
        let count = 0
        orders.forEach((order) => {
            if (order.review) {
                rating += order.review.rating
                count++
            }
        })
        rating = rating / count
        const reviews = orders.map((order) => order.review)
        //3. Return reviews and commissionService rating
        return {
            reviews,
            rating,
        }
    }

    static updateReview = async (userId, orderId, body) => {
        //1. Check order, user
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")
        if (order.memberId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        //2. Update review (Update order)
        body.userId = userId
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { review: body } },
            { new: true }
        ).populate("review.userId", "stageName avatar")

        return {
            review: updatedOrder.review,
        }
    }

    static deleteReview = async (userId, orderId) => {
        //1. Check order, user
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")
        if (order.memberId.toString() !== userId)
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        //2. Delete review (Update order)
        await Order.findByIdAndUpdate(
            orderId,
            { $unset: { review: "" } },
            { new: true }
        )

        return {
            message: "Review deleted successfully",
        }
    }
}

export default ReviewService
