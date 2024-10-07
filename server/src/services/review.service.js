import Order from "../models/order.model.js"
import { User } from "../models/user.model.js"
import Review from "../models/review.model.js"
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
        if(order.status !== "finished") throw new BadRequestError("Đơn hàng chưa hoàn thành")

        //2. Validate body
        if (!body.rating)
            throw new BadRequestError("Vui lòng nhập đủ thông tin")

        //3. Check who is the reviewer
        let reviewedUserId
        if(userId === order.memberId.toString()) {
            reviewedUserId = order.talentChosenId
        } else if(userId === order.talentChosenId.toString()){
            reviewedUserId = order.memberId
        }else{
            throw new BadRequestError("Bạn không thể review đơn hàng này")
        }

        const review = await Review.create({
            orderId,
            reviewerId: userId,
            reviewedUserId,
            content: body?.content,
            hashtags: body?.hashtags,
            rating: body?.rating,
        })

        return {
            review
        }
    }

    static readReviewsOrderId = async(orderId) => {
        //1. Check order
        const order = await Order.findById(orderId)
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")

        //2. Read reviews
        const reviews = await Review.find({orderId})
        if (!reviews) throw new NotFoundError("Không tìm thấy review")
        
        return {
            reviews
        }
    }

    static readReviews = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Không tìm thấy user")

        //2. Read reviews
        const reviews = await Review.find({reviewedUserId: userId})
        if (!reviews) throw new NotFoundError("Không tìm thấy review")
        
        return {
            reviews
        }
    }
}

export default ReviewService
