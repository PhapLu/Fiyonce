import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    NotFoundError,
} from "../core/error.response.js"
import Order from "../models/order.model.js"
import Proposal from "../models/proposal.model.js"

class TransactionDashboardService {
    static readTransactionOverview = async (adminId) => {
        // 1. Check admin
        const admin = await User.findById(adminId)
        if (!admin) throw new NotFoundError("Admin not found")
        if (admin.role !== "admin") throw new AuthFailureError("You are not the admin")

        // 2. Count confirmed orders per month
        const confirmedOrdersPerMonthResult = await Order.aggregate([
            { $match: { status: "confirmed" } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            }
        ])

        const totalConfirmedOrders = confirmedOrdersPerMonthResult.reduce((acc, curr) => {
            return acc + curr.count
        }, 0)

        // 3. Sum revenue per month (5% of the price in proposal linked by orderId)
        const revenuePerMonthResult = await Proposal.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "order"
                }
            },
            { $unwind: "$order" },
            { $match: { "order.status": "confirmed" } },
            {
                $group: {
                    _id: {
                        year: { $year: "$order.createdAt" },
                        month: { $month: "$order.createdAt" }
                    },
                    revenue: { $sum: { $multiply: ["$price", 0.05] } }
                }
            }
        ])

        const totalRevenue = revenuePerMonthResult.reduce((acc, curr) => {
            return acc + curr.revenue
        }, 0)

        // 4. Total order count
        const totalOrderCount = await Order.countDocuments()

        return {
            confirmedOrdersPerMonth: totalConfirmedOrders,
            revenuePerMonth: totalRevenue,
            totalOrderCount
        }
    }
}

export default TransactionDashboardService
