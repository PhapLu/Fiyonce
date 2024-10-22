import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    NotFoundError,
} from "../core/error.response.js"
import Order from "../models/order.model.js"
import Proposal from "../models/proposal.model.js"

class TransactionDashboardService {
    static readTransactionOverview = async (userId, query) => {
        const startDate = query.startDate;
        const endDate = query.endDate;

        // 1. Check admin
        const admin = await User.findById(userId);
        if (!admin) throw new NotFoundError("Admin not found");
        if (admin.role !== "admin") throw new AuthFailureError("You are not the admin");

        // 2. Date range filter
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            dateFilter.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.createdAt = { $lte: new Date(endDate) };
        }

        // 3. Count total orders in the date range
        const totalOrders = await Order.countDocuments(dateFilter);

        // 4. Count total indirect and direct orders in the date range
        const totalIndirectOrders = await Order.countDocuments({ ...dateFilter, isDirect: false });
        const totalDirectOrders = await Order.countDocuments({ ...dateFilter, isDirect: true });

        // 5. Order statuses and priority sorting
        const statusPriority = [
            "pending",
            "approved",
            "rejected",
            "confirmed",
            "in_progress",
            "delivered",
            "finished",
            "under_processing",
            "resolved"
        ];

        const statusCounts = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStatusCounts = statusCounts
            .map(({ _id, count }) => ({
                title: _id,
                count
            }))
            .sort((a, b) => statusPriority.indexOf(a.title) - statusPriority.indexOf(b.title));

        // 6. Define order statuses for the new calculations
        const relevantStatusesForAchievable = ["in_progress", "confirmed", "delivered", "finished"];
        const relevantStatusesForAchieved = ["finished"];
        const relevantStatusesForUpcoming = ["delivered"];
        const relevantStatusesForUnachievable = ["rejected", "resolved"];

        // 7. Calculate achievableVolume, achievedVolume, etc.
        const aggregateVolume = async (statuses) => {
            const orders = await Order.find({ status: { $in: statuses } }).select('_id');
            const orderIds = orders.map(order => order._id);
            const result = await Proposal.aggregate([
                {
                    $match: { orderId: { $in: orderIds } }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$price" }
                    }
                }
            ]);

            return result.length > 0 ? result[0].totalAmount : 0;
        };

        const achievableVolume = await aggregateVolume(relevantStatusesForAchievable);
        const achievedVolume = await aggregateVolume(relevantStatusesForAchieved);
        const upcomingAchievableVolume = await aggregateVolume(relevantStatusesForUpcoming);
        const unachievableVolume = await aggregateVolume(relevantStatusesForUnachievable);

        // 8. Calculate income based on the volumes
        const commissionRate = 0.045;
        const estimatedAchievableIncome = achievableVolume * commissionRate;
        const estimatedAchievedIncome = achievedVolume * commissionRate;
        const estimatedUpcomingAchievableIncome = upcomingAchievableVolume * commissionRate;
        const estimatedUnachievableIncome = unachievableVolume * commissionRate;

        // 9. Return the result
        const result = {
            totalOrders,
            totalIndirectOrders,
            totalDirectOrders,
            statusCounts: formattedStatusCounts, // Sorted by the custom priority
            achievableVolume,
            estimatedAchievableIncome,
            achievedVolume,
            estimatedAchievedIncome,
            upcomingAchievableVolume,
            estimatedUpcomingAchievableIncome,
            unachievableVolume,
            estimatedUnachievableIncome
        };

        return { transactionOverview: result };
    };


    static calculateIncomeOverview = async (userId) => {
        // 1. Check admin
        const admin = await User.findById(userId)
        if (!admin) throw new NotFoundError("Admin not found")
        if (admin.role !== "admin") throw new AuthFailureError("You are not the admin")

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

        // 7. Calculate the estimated income as 0.45% of the total sum
        const estimatedIncome = totalSum * 0.0045;

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
