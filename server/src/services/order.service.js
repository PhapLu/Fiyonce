import Order from "../models/order.model.js"
import Proposal from "../models/proposal.model.js"
import CommissionService from "../models/commissionService.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import {
    compressAndUploadImage,
    extractPublicIdFromUrl,
    deleteFileByPublicId,
    uploadFinalProduct,
} from "../utils/cloud.util.js"
import { sendAnnouncementEmail } from "../configs/brevo.email.config.js"
import mongoose from "mongoose"
import { formatDate } from "../utils/index.js"
import { setCacheIOExpiration } from "../models/repositories/cache.repo.js"

const CACHE_EXPIRATION_SECONDS = 600;

class OrderService {
    //Order CRUD
    static createOrder = async (userId, req) => {
        //1. Get type, talentChosenId and check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        if (req.body.fileFormats) {
            const fileFormats = req.body.fileFormats.split(",")
            req.body.fileFormats = fileFormats
        }
        const body = req.body


        const { isDirect, commissionServiceId, isWaitList } = body
        const commissionService = await CommissionService.findById(
            commissionServiceId
        )

        //2. Check isDirect of order
        let talent = null
        if (isDirect == 'true') {
            //direct order
            const service = await CommissionService.findById(
                commissionServiceId
            )
            const talentChosenId = service.talentId
            talent = await User.findById(talentChosenId)

            if (!talent) throw new BadRequestError("Talent not found!")
            if (talent.role != "talent")
                throw new AuthFailureError("He/She is not a talent!")
            if (talent._id.toString() == userId)
                throw new BadRequestError("You cannot choose yourself!")
            body.isDirect = true
            body.talentChosenId = talentChosenId
            body.commissionServiceId = commissionServiceId
        } else {
            //inDirect order
            body.isDirect = false
            body.talentChosenId = null
        }

        //3. Upload req.files.files to cloudinary
        try {
            let references = []

            if (req.files && req.files.files && req.files.files.length > 0) {
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/order/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                references = uploadResults.map((result) => result.secure_url)
            }

            //4. Create order
            if (isWaitList == 'true') {
                if (commissionService.status !== 'waitList')
                    throw new BadRequestError('Dịch vụ này đang mở')
                body.status = "waitlist"
            } else {
                body.status = "pending"
            }

            const order = new Order({
                memberId: userId,
                references,
                ...body,
            })
            await order.save()

            //5. Send email to talent
            if (isDirect == 'true' && talent?.email) {
                try {
                    const subject = `[PASTAL] - Yêu cầu đặt hàng (${formatDate()})`
                    const message = `Khách hàng ${user.fullName} đã đặt commission ${commissionService.title} của bạn`
                    const orderCode = `Mã đơn hàng: ${order._id.toString()}`
                    const reason = ""
                    await sendAnnouncementEmail(talent.email, subject, message, orderCode, reason)
                } catch (error) {
                    console.log(error)
                    throw new BadRequestError("Email service error")
                }
            }

            return {
                order,
            }
        } catch (error) {
            console.log("Error uploading images or saving order:", error)
            throw new BadRequestError("File upload or database save failed")
        }
    }

    static readOrder = async (orderId) => {
        try {
            const order = await Order.findById(orderId)
                .populate('memberId', "avatar fullName")
                .populate('talentChosenId', "avatar fullName")
                .populate('commissionServiceId', "title")
                .lean()

            if (!order) {
                throw new Error('Order not found')
            }

            const proposalsCount = await Proposal.countDocuments({ orderId })
            order.proposalsCount = proposalsCount

            const orderData = { order };

            // Cache the result for future requests
            const cacheKey = `order-k-${orderId}`;
            await setCacheIOExpiration({
                key: cacheKey,
                value: JSON.stringify(orderData),
                expirationInSeconds: CACHE_EXPIRATION_SECONDS,
            });
            return orderData
        } catch (error) {
            console.error('Error reading order:', error)
            throw error
        }
    }

    //Client read approved indirect orders in commission market
    static readOrders = async (req) => {
        console.log('Cache miss: Reading orders from database');
        const q = req.query
        const cacheKey = `orders-k-direct-${q.isDirect}`
        const filters = {
            isMemberArchived: false,
            ...(q.isDirect !== undefined && { isDirect: q.isDirect === 'true' }),
        }

        //1. Get all orders
        const orders = await Order.find(filters)
            .sort({ createdAt: -1 }) // Sort orders by createdAt in descending order
            .populate("talentChosenId", "fullName avatar")
            .populate("memberId", "fullName avatar")

        //2. Iterate over each order to add talentsApprovedCount
        const ordersWithCounts = await Promise.all(
            orders.map(async (order) => {
                const talentsApprovedCount = await Proposal.find({
                    orderId: order._id,
                }).countDocuments()
                order._doc.talentsApprovedCount = talentsApprovedCount // Add the count to the order
                return order
            })
        )
        // 3. Store the processed orders in Redis
        const dataToCache = { orders: ordersWithCounts };
        await setCacheIOExpiration({ 
            key: cacheKey, 
            value: JSON.stringify(dataToCache),
            expirationInSeconds: CACHE_EXPIRATION_SECONDS,
         });

        // 4. Return the orders
        return dataToCache;
    }

    static updateOrder = async (userId, orderId, req) => {
        console.log("kkk")
        console.log(req.body)
        //1. check order and user
        const oldOrder = await Order.findById(orderId)
        const foundUser = await User.findById(userId)
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!oldOrder) throw new NotFoundError("Không tìm thấy đơn hàng")
        if (oldOrder.memberId.toString() !== userId)
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        if (req.body.fileFormats) {
            const fileFormats = req.body.fileFormats.split(",")
            req.body.fileFormats = fileFormats
        }
        //2. Check order status
        if (oldOrder.status != "pending" && oldOrder.talentChosenId)
            throw new BadRequestError("Bạn không thể cập nhật đơn hàng ở bước này")
        try {
            //3. Handle file uploads if new files were uploaded
            if (req.files && req.files.files && req.files.files.length > 0) {
                // Upload new files to Cloudinary
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/order/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )
                const uploadResults = await Promise.all(uploadPromises)
                const references = uploadResults.map(
                    (result) => result.secure_url
                )
                req.body.references = references

                //Delete old images from cloudinary
                const publicIds = oldOrder.references.map((reference) =>
                    extractPublicIdFromUrl(reference)
                )
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                )
            }

            //4. Validate body and merge existing service fields with req.body to ensure fields not provided in req.body are retained
            const { memberId, talentChosenId, ...filteredBody } = req.body
            const updatedFields = { ...oldOrder.toObject(), ...filteredBody }

            //5. update Order
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                updatedFields,
                { new: true }
            )

            return {
                order: updatedOrder,
            }
        } catch (error) {
            console.log("Error in updating commission service:", error)
            throw new Error("Service update failed")
        }
    }

    //End Order CRUD

    static readMemberOrderHistory = async (clientId) => {
        //1. Check user
        const foundUser = await User.findById(clientId)
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")


        //2. Get orders
        let orders;
        try {
            orders = await Order.find({ memberId: clientId, isMemberArchived: false })
                .populate("talentChosenId", "stageName avatar fullName stageName")
                .populate("memberId", "fullName avatar")
                .populate("commissionServiceId", "price title")
                .sort({ createdAt: -1 })
        } catch (error) {
            console.error("Error populating orders:", error)
            throw new Error("Failed to fetch orders")
        }

        console.log(orders)

        return {
            memberOrderHistory: orders,
        }
    }

    static readRejectResponse = async (userId, orderId) => {
        // 1. Find the order by ID and select memberId, talentChosenId, and rejectMessage
        const order = await Order.findById(orderId, { memberId: 1, talentChosenId: 1, rejectMessage: 1 });

        // 2. Check if the order exists
        if (!order) {
            throw new NotFoundError("Order not found");
        }

        // 3. Check if the userId is either the memberId or the talentChosenId
        if (order.memberId.toString() !== userId && order.talentChosenId.toString() !== userId) {
            throw new ForbiddenError("You are not authorized to view this reject response");
        }

        // 4. Return the necessary fields: talentId and rejectMessage
        return {
            talentId: order.talentChosenId,
            rejectMessage: order.rejectMessage
        };
    }

    static readTalentOrderHistory = async (talentId) => {
        // 1. Check if the talent exists and is of role 'talent'
        const foundTalent = await User.findById(talentId);
        if (!foundTalent) throw new NotFoundError("Không tìm thấy họa sĩ");
        if (foundTalent.role !== "talent")
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này");

        try {
            // 2. Aggregate to get all orders involving the talent
            const orders = await Order.aggregate([
                // Lookup to get details from Proposal if exists
                {
                    $lookup: {
                        from: "Proposals",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "proposals",
                    },
                },
                // Match orders where the talent is chosen or has a proposal
                {
                    $match: {
                        $and: [
                            {
                                $or: [
                                    {
                                        talentChosenId: new mongoose.Types.ObjectId(talentId),
                                    },
                                    {
                                        "proposals.talentId": new mongoose.Types.ObjectId(talentId),
                                        talentChosenId: null,
                                    },
                                ],
                            },
                            {
                                $or: [
                                    { isTalentArchived: { $exists: false } },
                                    { isTalentArchived: false },
                                ],
                            },
                        ],
                    },
                },
                // Lookup to get member details
                {
                    $lookup: {
                        from: "Users",
                        localField: "memberId",
                        foreignField: "_id",
                        as: "memberDetails",
                    },
                },
                // Lookup to get commission service details
                {
                    $lookup: {
                        from: "CommissionServices",
                        localField: "commissionServiceId",
                        foreignField: "_id",
                        as: "commissionServiceDetails",
                    },
                },
                // Additional lookup for proposal details
                {
                    $lookup: {
                        from: "Proposals",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "proposalDetails",
                    },
                },
                // Project to shape the output
                {
                    $project: {
                        commissionServiceId: {
                            _id: { $arrayElemAt: ["$commissionServiceDetails._id", 0] },
                            title: { $arrayElemAt: ["$commissionServiceDetails.title", 0] },
                        },
                        memberId: {
                            _id: { $arrayElemAt: ["$memberDetails._id", 0] },
                            avatar: { $arrayElemAt: ["$memberDetails.avatar", 0] },
                            fullName: { $arrayElemAt: ["$memberDetails.fullName", 0] },
                        },
                        talentChosenId: {
                            _id: { $arrayElemAt: ["$talentDetails._id", 0] },
                            avatar: { $arrayElemAt: ["$talentDetails.avatar", 0] },
                            fullName: { $arrayElemAt: ["$talentDetails.fullName", 0] },
                            stageName: { $arrayElemAt: ["$talentDetails.stageName", 0] },
                        },
                        status: 1,
                        title: 1,
                        description: 1,
                        isDirect: 1,
                        references: 1,
                        rejectMessage: 1,
                        minPrice: 1,
                        maxPrice: 1,
                        purpose: 1,
                        isPrivate: 1,
                        deadline: 1,
                        fileFormats: 1,
                        createdAt: 1,
                        proposalId: {
                            _id: { $arrayElemAt: ["$proposalDetails._id", 0] },
                            scope: { $arrayElemAt: ["$proposalDetails.scope", 0] },
                            startAt: { $arrayElemAt: ["$proposalDetails.startAt", 0] },
                            deadline: { $arrayElemAt: ["$proposalDetails.deadline", 0] },
                            price: { $arrayElemAt: ["$proposalDetails.price", 0] },
                            rejectMessage: { $arrayElemAt: ["$proposalDetails.rejectMessage", 0] },
                        }
                    },
                },
                {
                    $sort: {
                        createdAt: -1, // Use 1 for ascending order
                    },
                },
            ]);

            return {
                talentOrderHistory: orders,
            };
        } catch (error) {
            console.error("Error fetching orders by talent:", error);
            throw error;
        }
    };


    static readArchivedOrderHistory = async (userId) => {
        try {
            // Aggregate to get all archived orders involving the user
            const orders = await Order.aggregate([
                // Lookup to get details from Proposal if exists
                {
                    $lookup: {
                        from: "Proposals",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "proposals",
                    },
                },
                // Match orders where the talent is chosen or has a proposal
                {
                    $match: {
                        $or: [
                            // Order owner as member
                            {
                                $and: [
                                    { memberId: new mongoose.Types.ObjectId(userId) },
                                    { isMemberArchived: true },
                                ]
                            },

                            // Order owner as talent
                            {
                                $and: [
                                    {
                                        "proposals.talentId": new mongoose.Types.ObjectId(userId),
                                    },
                                    { isTalentArchived: true },
                                ]
                            }

                        ]
                    },
                },
                // Lookup to get member details
                {
                    $lookup: {
                        from: "Users",
                        localField: "memberId",
                        foreignField: "_id",
                        as: "memberDetails",
                    },
                },
                // Lookup to get talent details
                {
                    $lookup: {
                        from: "Users",
                        localField: "talentChosenId",
                        foreignField: "_id",
                        as: "talentDetails",
                    },
                },
                // Lookup to get commission service details
                {
                    $lookup: {
                        from: "CommissionServices",
                        localField: "commissionServiceId",
                        foreignField: "_id",
                        as: "commissionServiceDetails",
                    },
                },
                // Additional lookup for proposal details
                {
                    $lookup: {
                        from: "Proposals",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "proposalDetails",
                    },
                },
                // Project to shape the output
                {
                    $project: {
                        commissionServiceId: {
                            _id: { $arrayElemAt: ["$commissionServiceDetails._id", 0] },
                            title: { $arrayElemAt: ["$commissionServiceDetails.title", 0] },
                        },
                        memberId: {
                            _id: { $arrayElemAt: ["$memberDetails._id", 0] },
                            avatar: { $arrayElemAt: ["$memberDetails.avatar", 0] },
                            fullName: { $arrayElemAt: ["$memberDetails.fullName", 0] },
                        },
                        talentChosenId: {
                            _id: { $arrayElemAt: ["$talentDetails._id", 0] },
                            avatar: { $arrayElemAt: ["$talentDetails.avatar", 0] },
                            fullName: { $arrayElemAt: ["$talentDetails.fullName", 0] },
                            stageName: { $arrayElemAt: ["$talentDetails.stageName", 0] },
                        },
                        status: 1,
                        title: 1,
                        description: 1,
                        isDirect: 1,
                        references: 1,
                        rejectMessage: 1,
                        minPrice: 1,
                        maxPrice: 1,
                        purpose: 1,
                        isPrivate: 1,
                        deadline: 1,
                        fileFormats: 1,
                        createdAt: 1,
                        proposalId: {
                            _id: { $arrayElemAt: ["$proposalDetails._id", 0] },
                            scope: { $arrayElemAt: ["$proposalDetails.scope", 0] },
                            startAt: { $arrayElemAt: ["$proposalDetails.startAt", 0] },
                            deadline: { $arrayElemAt: ["$proposalDetails.deadline", 0] },
                            price: { $arrayElemAt: ["$proposalDetails.price", 0] },
                            rejectMessage: { $arrayElemAt: ["$proposalDetails.rejectMessage", 0] },
                        }
                    },
                },
                {
                    $project: {
                        proposalId: 1,
                        commissionServiceId: 1,
                        memberId: 1,
                        talentChosenId: 1,
                        status: 1,
                        title: 1,
                        description: 1,
                        isDirect: 1,
                        references: 1,
                        rejectMessage: 1,
                        minPrice: 1,
                        maxPrice: 1,
                        purpose: 1,
                        isPrivate: 1,
                        deadline: 1,
                        fileFormats: 1,
                        createdAt: 1,
                    },
                },
                {
                    $sort: {
                        createdAt: -1 // Use 1 for ascending order
                    }
                }
            ]);

            return { archivedOrderHistory: orders }
        } catch (error) {
            console.error("Error fetching archived orders:", error)
            throw error
        }
    }

    static archiveOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")

        if (userId == order.memberId.toString()) {
            order.isMemberArchived = true
        } else {
            order.isTalentArchived = true
        }

        order.save()

        return {
            order,
        }
    }
    static unarchiveOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")

        if (userId == order.memberId.toString()) {
            order.isMemberArchived = false
        } else {
            order.isTalentArchived = false
        }

        order.save()

        return {
            order,
        }
    }

    static rejectOrder = async (userId, orderId, req) => {
        console.log("OOOOO")
        console.log(req.body)
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        const { rejectMessage } = req.body;

        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")
        if (!rejectMessage) new NotFoundError("Vui lòng nhập lí do từ chối")

        //2. Check if user is authorized to deny order
        if (user.role !== "talent")
            throw new AuthFailureError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        //3. Check if order status is pending
        if (order.status !== "pending")
            throw new BadRequestError("Bạn không thể từ chối đơn hàng ở bước này")

        //4. Deny order
        order.status = "rejected";
        order.rejectMessage = rejectMessage;
        await order.save()

        //5. Show order
        const deniedOrder = order.populate(
            "talentChosenId",
            "stageName avatar"
        )

        //6. Send email to user
        const member = await User.findById(order.memberId)
        try {
            const subject = `[PASTAL] - Đơn hàng đã bị từ chối (${formatDate()})`
            const message = `Họa sĩ ${user.fullName} đã từ chối đơn đặt hàng của bạn`
            const orderCode = `Mã đơn hàng: ${order._id.toString()}`
            const reason = ''
            await sendAnnouncementEmail(member.email, subject, message, orderCode, reason)
        } catch (error) {
            console.error("Error sending email:", error)
            throw new BadRequestError("Email service error")
        }

        return {
            order: deniedOrder,
        }
    }

    static startWipOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId).populate("talentChosenId", "stageName avatar")
            .populate("memberId", "fullName avatar email")
            .populate("commissionServiceId", "title");
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (user.role !== "talent") throw new BadRequestError("You are not a talent");
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng");
        if (order.status !== "confirmed") throw new BadRequestError("Đơn hàng chưa được xác nhận ở hiện tại");
        if (order.talentChosenId._id.toString() !== userId) throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");

        //2. Start work
        order.status = "in_progress"
        order.save()

        //3. Send email to user
        const subject = `[PASTAL] - Đơn hàng đang được thực hiện (${formatDate()})`
        const subSubject = `Họa sĩ ${user.fullName} đã tiến hành thực hiện đơn hàng của bạn.`
        const message = ` Bạn và họa sĩ có thể trao đổi chi tiết hơn qua tin nhắn.`
        sendAnnouncementEmail(order.memberId.email, subject, subSubject, message);

        return {
            order,
        }
    }

    // Client confirm finishing order
    static finishOrder = async (userId, orderId) => {
        //1. Check user, order
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")
        if (order.memberId.toString() !== userId) throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")
        if(order.status !== "delivered") throw new BadRequestError("Order is not delivered yet")

        //2. Finish order
        order.status = "finished"
        order.save()

        //3. Send email to talent
        const talent = await User.findById(order.talentChosenId)
        const subject = `[PASTAL] - Đơn hàng đã hoàn tất (${formatDate()})`
        const subSubject = `${user.fullName} đã xác nhận hoàn tất đơn hàng của bạn.`
        const message = ``
        sendAnnouncementEmail(talent.email, subject, subSubject, message);

        return {
            order
        }
    }

    static addMilestone = async (userId, orderId, req) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== 'talent') throw new NotFoundError("You are not a talent")
        if (!order) throw new NotFoundError("Không tìm thấy đơn hàng")
        if (!order.talentChosenId || order.talentChosenId.toString() !== userId)
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")

        //2. Check if order status is in_progress
        if (order.status !== "in_progress")
            throw new BadRequestError("Đơn hàng không ở trạng thái đang thực hiện")

        //3. Handle files in milestone
        let files = []
        if (req.files && req.files.files && req.files.files.length > 0) {
            const uploadPromises = req.files.files.map((file) =>
                compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/order/${userId}`,
                    width: 1920,
                    height: 1080,
                })
            )
            const uploadResults = await Promise.all(uploadPromises)
            files = uploadResults.map((result) => result.secure_url)
        }
        const milestone = {
            title: req.body.title,
            files: files,
            url: req.body.url,
            note: req.body.note,
            createdAt: new Date(),
        }
        order.milestones.push(milestone)
        order.save()

        //4. Send email to user
        const member = await User.findById(order.memberId)
        const subject = `[PASTAL] - Đơn hàng đã được cập nhật bản thảo (${formatDate()})`
        const subSubject = `Họa sĩ ${user.fullName} đã cập nhật bản thảo cho đơn hàng của bạn.`
        const message = ` Bạn và họa sĩ có thể trao đổi về bản thảo chi tiết hơn qua tin nhắn`
        sendAnnouncementEmail(member.email, subject, subSubject, message);

        return {
            order,
        }
    }

    static deliverOrder = async (userId, orderId, req) => {
        //1. Check talent, order
        const body = req.body
        const talent = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!talent) throw new NotFoundError("Talent not found")
        if (talent.role !== "talent") throw new BadRequestError("You are not a talent")
        if (!order) throw new NotFoundError("Order not found")
        if (order.talentChosenId.toString() !== userId) throw new AuthFailureError("You are not authorized to deliver this order")
        if (order.status !== "in_progress") throw new BadRequestError("Order is not in progress")

        //2. Deliver order
        // Validate input
        if (!req.files && !body?.url)
            throw new BadRequestError("No files or url provided for delivery")

        // Upload new files to Cloudinary using uploadFinalProduct function
        if (req.files && req.files.files && req.files.files.length > 0) {
            const uploadPromises = req.files.files.map((file) =>
                compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/order/${userId}`,
                })
            )
            const uploadResults = await Promise.all(uploadPromises)
            const deliveryFiles = uploadResults.map((result) => result.secure_url)
            order.finalDelivery.files = deliveryFiles
        }
        order.finalDelivery.url = body?.url
        order.finalDelivery.note = body?.note
        order.finalDelivery.deliveryAt = new Date()
        order.status = "delivered"
        await order.save()

        //3. Send email to user
        const member = await User.findById(order.memberId)
        const subject = `[PASTAL] - Đơn hàng đã được bàn giao (${formatDate()})`
        const subSubject = `Họa sĩ ${talent.fullName} đã bàn giao sản phẩm cho đơn hàng của bạn.`
        const message = ` Bạn và họa sĩ có thể trao đổi về sản phẩm chi tiết hơn qua tin nhắn`
        sendAnnouncementEmail(member.email, subject, subSubject, message);

        return {
            order,
        };
    }
}

export default OrderService