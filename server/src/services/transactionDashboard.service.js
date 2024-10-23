import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    NotFoundError,
} from "../core/error.response.js"
import Order from "../models/order.model.js"
import Proposal from "../models/proposal.model.js"

class TransactionDashboardService {
    // static readTransactionOverview = async (adminId) => {
    //     // 1. Check admin
    //     const admin = await User.findById(adminId)
    //     if (!admin) throw new NotFoundError("Admin not found")
    //     if (admin.role !== "admin") throw new AuthFailureError("You are not the admin")

    //     // 2. Count confirmed orders per month
    //     const confirmedOrdersPerMonthResult = await Order.aggregate([
    //         { $match: { status: "confirmed" } },
    //         {
    //             $group: {
    //                 _id: {
    //                     year: { $year: "$createdAt" },
    //                     month: { $month: "$createdAt" }
    //                 },
    //                 count: { $sum: 1 }
    //             }
    //         }
    //     ])

    //     const totalConfirmedOrders = confirmedOrdersPerMonthResult.reduce((acc, curr) => {
    //         return acc + curr.count
    //     }, 0)

    //     // 3. Sum revenue per month (5% of the price in proposal linked by orderId)
    //     const revenuePerMonthResult = await Proposal.aggregate([
    //         {
    //             $lookup: {
    //                 from: "orders",
    //                 localField: "orderId",
    //                 foreignField: "_id",
    //                 as: "order"
    //             }
    //         },
    //         { $unwind: "$order" },
    //         { $match: { "order.status": "confirmed" } },
    //         {
    //             $group: {
    //                 _id: {
    //                     year: { $year: "$order.createdAt" },
    //                     month: { $month: "$order.createdAt" }
    //                 },
    //                 revenue: { $sum: { $multiply: ["$price", 0.05] } }
    //             }
    //         }
    //     ])

    //     const totalRevenue = revenuePerMonthResult.reduce((acc, curr) => {
    //         return acc + curr.revenue
    //     }, 0)

    //     // 4. Total order count
    //     const totalOrderCount = await Order.countDocuments()

    //     return {
    //         confirmedOrdersPerMonth: totalConfirmedOrders,
    //         revenuePerMonth: totalRevenue,
    //         totalOrderCount
    //     }
    // }
    static readTransactionOverview = async (userId) => {
        // 1. Check admin
        const admin = await User.findById(userId);
        if (!admin) throw new NotFoundError("Admin not found");
        if (admin.role !== "admin") throw new AuthFailureError("You are not the admin");
    
        // 2. Count total orders
        const totalOrders = await Order.countDocuments();
    
        // 3. Count total indirect and direct orders
        const totalIndirectOrders = await Order.countDocuments({ isDirect: false });
        const totalDirectOrders = await Order.countDocuments({ isDirect: true });
    
        // 4. Count total orders by each status
        const statusCounts = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
    
        // 5. Format the result
        const result = {
            totalOrders,
            totalIndirectOrders,
            totalDirectOrders,
            statusCounts: statusCounts.reduce((acc, { _id, count }) => {
                acc[_id] = count;
                return acc;
            }, {})
        };
    
        return {
            result
        }
    };

    static calculateIncomeOverview = async (userId) => {
        // 1. Check admin
        const admin = await User.findById(userId)
        if (!admin) throw new NotFoundError("Admin not found")
        if(admin.role !== "admin") throw new AuthFailureError("You are not the admin")

        // 2. Define the relevant order statuses
        const relevantStatuses = ["in_progress", "confirmed", "delivered", "finished"];
    
        // 3. Find orders with relevant statuses
        const orders = await Order.find({ status: { $in: relevantStatuses } }).select('_id');
    
        // 4. Extract the order IDs
        const orderIds = orders.map(order => order._id);
    
        // 5. Aggregate proposals to calculate the required values
        const results = await Proposal.aggregate([
            {
                $match: { orderId: { $in: orderIds } }
            },
            {
                $group: {
                    _id: null,
                    totalSum: { $sum: "$price" },
                    averagePrice: { $avg: "$price" },
                    maxPrice: { $max: "$price" },
                    minPrice: { $min: "$price" }
                }
            }
        ]);
    
        if (results.length === 0) {
            // If no proposals are found, return zero values
            return {
                estimatedIncome: 0,
                averagePrice: 0,
                maxPrice: 0,
                minPrice: 0
            };
        }
    
        // 6. Extract the calculated values
        const { totalSum, averagePrice, maxPrice, minPrice } = results[0];
        
        // 7. Calculate the estimated income as 4.5% of the total sum
        const estimatedIncome = totalSum * 0.045;
    
        // 8. Return the results
        return {
            estimatedIncome,
            averagePrice,
            maxPrice,
            minPrice
        };
    };
}

export default TransactionDashboardService
