import Order from "../models/order.model.js"
import Artwork from "../models/artwork.model.js"
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
} from "../utils/cloud.util.js"
import brevoSendEmail from "../configs/brevo.email.config.js"
import mongoose from "mongoose"

class OrderService {
    //Order CRUD
    static createOrder = async (userId, req) => {
        //1. Get type, talentChosenId and check user
        const user = await User.findById(userId)
        const fileFormats = req.body.fileFormats.split(",");
        req.body.fileFormats = fileFormats;
        const body = req.body


        const { isDirect, commissionServiceId, isWaitList } = body
        const commissionService = await CommissionService.findById(
            commissionServiceId
        )

        //2. Check isDirect of order
        let talent = null;
        if (isDirect == 'true') {
            //direct order
            const service = await CommissionService.findById(
                commissionServiceId
            )
            const talentChosenId = service.talentId;
            talent = await User.findById(talentChosenId)

            if (!talent) throw new BadRequestError("Talent not found!")
            if (!service)
                throw new BadRequestError("commissionService not found!")
            if (talent.role != "talent")
                throw new AuthFailureError("He/She is not a talent!")
            if (talent._id == userId)
                throw new BadRequestError("You cannot choose yourself!")
            body.isDirect = true
            body.talentChosenId = talentChosenId
            body.minPrice = commissionService.minPrice
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

            //5. Send email to user
            if (isDirect == 'true' && talent?.email) {
                try {
                    const subject = ""
                    const subjectMessage = ""
                    const verificationCode = ""
                    const message = `You have a new order from ${user.fullName}. Please check the order details and accept or reject the order.`
                    const template = "announcementTemplate"
                    await brevoSendEmail(
                        talent.email,
                        subject,
                        subjectMessage,
                        verificationCode,
                        message,
                        template
                    )
                } catch (error) {
                    console.log(error)
                    throw new BadRequestError("Email service error");
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
                .populate('commissionServiceId', "title")
                .lean();

            if (!order) {
                throw new Error('Order not found');
            }

            const proposalsCount = await Proposal.countDocuments({ orderId });
            order.proposalsCount = proposalsCount;
            return {
                order
            };
        } catch (error) {
            console.error('Error reading order:', error);
            throw error;
        }
    };

    //Client read approved indirect orders in commission market
    static readOrders = async (req) => {
        const q = req.query
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

        return {
            orders: ordersWithCounts,
        }
    }

    static updateOrder = async (userId, orderId, req) => {
        //1. check order and user
        const oldOrder = await Order.findById(orderId)
        const foundUser = await User.findById(userId)
        if (!foundUser) throw new NotFoundError("User not found!")
        if (!oldOrder) throw new NotFoundError("Order not found!")
        if (oldOrder.memberId.toString() !== userId)
            throw new AuthFailureError("You can update only your order")

        const fileFormats = req.body.fileFormats.split(",");
        req.body.fileFormats = fileFormats;
        //2. Check order status
        if (oldOrder.status != "pending")
            throw new BadRequestError("You cannot update order on this stage!")
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
        if (!foundUser) throw new NotFoundError("User not found!")

        //2. Get orders
        let orders
        try {
            orders = await Order.find({ memberId: clientId, isMemberArchived: false })
                .populate("talentChosenId", "stageName avatar")
                .populate("memberId", "fullName avatar")
                .populate("commissionServiceId", "price title")
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error("Error populating orders:", error)
            throw new Error("Failed to fetch orders")
        }

        return {
            memberOrderHistory: orders,
        }
    }


    static readTalentOrderHistory = async (talentId) => {
        // 1. Check if the talent exists and is of role 'talent'
        const foundTalent = await User.findById(talentId)
        if (!foundTalent) throw new NotFoundError("Talent not found!")
        if (foundTalent.role !== "talent")
            throw new BadRequestError("You are not a talent!")

        try {
            // 2. Aggregate to get all orders involving the talent
            const orders = await Order.aggregate([
                // Match orders where the talent is chosen or has a proposal
                {
                    $match: {
                        $and: [
                            {
                                $or: [
                                    {
                                        talentChosenId:
                                            new mongoose.Types.ObjectId(
                                                talentId
                                            ),
                                    },
                                    {
                                        "proposals.talentId":
                                            new mongoose.Types.ObjectId(
                                                talentId
                                            ),
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
                // Lookup to get details from Proposal if exists
                {
                    $lookup: {
                        from: "Proposals",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "proposals",
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
                {
                    $lookup: {
                        from: "CommissionServices",
                        localField: "commissionServiceId",
                        foreignField: "_id",
                        as: "commissionServiceDetails",
                    },
                },
                // Project to shape the output
                {
                    $project: {
                        commissionServiceId: {
                            _id: {
                                $arrayElemAt: [
                                    "$commissionServiceDetails._id",
                                    0,
                                ],
                            },
                            title: {
                                $arrayElemAt: [
                                    "$commissionServiceDetails.title",
                                    0,
                                ],
                            },
                        },
                        memberId: {
                            _id: { $arrayElemAt: ["$memberDetails._id", 0] },
                            avatar: {
                                $arrayElemAt: ["$memberDetails.avatar", 0],
                            },
                            fullName: {
                                $arrayElemAt: ["$memberDetails.fullName", 0],
                            },
                        },
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
                        review: 1,
                        proposalId: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$proposals",
                                        as: "proposal",
                                        cond: {
                                            $eq: [
                                                "$$proposal.talentId",
                                                new mongoose.Types.ObjectId(
                                                    talentId
                                                ),
                                            ],
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        proposalId: "$proposalId",
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
                        review: 1,
                    },
                },
            ])

            console.log(orders)

            return {
                talentOrderHistory: orders
            }
        } catch (error) {
            console.error("Error fetching orders by talent:", error)
            throw error
        }
    }

    static readArchivedOrderHistory = async (userId) => {
        try {
            // Aggregate to get all archived orders involving the user
            const orders = await Order.aggregate([
                // Match orders where the user is a member or talent and the order is archived
                {
                    $match: {
                        $or: [
                            {
                                memberId: new mongoose.Types.ObjectId(userId),
                                isMemberArchived: true,
                            },
                            {
                                $or: [
                                    {
                                        talentChosenId:
                                            new mongoose.Types.ObjectId(userId),
                                    },
                                    {
                                        "proposals.talentId":
                                            new mongoose.Types.ObjectId(userId),
                                    }, // Ensures orders with proposals by talentId
                                ],
                                isTalentArchived: true,
                            },
                        ],
                    },
                },
                // Lookup to get details from Proposal if exists
                {
                    $lookup: {
                        from: "Proposals",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "proposals",
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
                {
                    $lookup: {
                        from: "CommissionServices",
                        localField: "commissionServiceId",
                        foreignField: "_id",
                        as: "commissionServiceDetails",
                    },
                },
                // Project to shape the output
                {
                    $project: {
                        commissionServiceId: {
                            _id: {
                                $arrayElemAt: [
                                    "$commissionServiceDetails._id",
                                    0,
                                ],
                            },
                            title: {
                                $arrayElemAt: [
                                    "$commissionServiceDetails.title",
                                    0,
                                ],
                            },
                        },
                        memberId: {
                            _id: { $arrayElemAt: ["$memberDetails._id", 0] },
                            avatar: {
                                $arrayElemAt: ["$memberDetails.avatar", 0],
                            },
                            fullName: {
                                $arrayElemAt: ["$memberDetails.fullName", 0],
                            },
                        },
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
                        review: 1,
                    },
                },
            ])

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
        if (!user) throw new NotFoundError("User not found")
        if (!order) throw new NotFoundError("Order not found")

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
        if (!user) throw new NotFoundError("User not found")
        if (!order) throw new NotFoundError("Order not found")

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

    static rejectOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId)
        const order = await Order.findById(orderId)
        if (!user) throw new NotFoundError("User not found")
        if (!order) throw new NotFoundError("Order not found")

        //2. Check if user is authorized to deny order
        if (user.role !== "talent")
            throw new AuthFailureError(
                "You are not authorized to deny this order"
            )

        //3. Check if order status is pending
        if (order.status !== "pending")
            throw new BadRequestError("You cannot deny this order")

        //4. Deny order
        order.status = "rejected"
        order.save()

        //5. Show order
        const deniedOrder = order.populate(
            "talentChosenId",
            "stageName avatar"
        )

        //6. Send email to user
        const member = await User.findById(order.memberId)
        try {
            const subject = ""
            const subjectMessage = ""
            const verificationCode = ""
            const message = 'Your order has been denied by the talent you chose. Please check the order details and try again with another talent.'
            const template = "announcementTemplate"
            await brevoSendEmail(
                member.email,
                subject,
                subjectMessage,
                verificationCode,
                message,
                template
            )
        } catch (error) {
            console.error("Error sending email:", error)
            throw new BadRequestError("Email service error")
        }

        return {
            order: deniedOrder,
        };
    };

    static startWipOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId);
        const order = await Order.findById(orderId).populate("talentChosenId", "stageName avatar")
            .populate("memberId", "fullName avatar")
            .populate("commissionServiceId", "title");;
        if (!user) throw new NotFoundError("User not found");
        if (!order) throw new NotFoundError("Order not found");
        if (order.status !== "confirmed") throw new BadRequestError("Order is not confirmed yet");
        if (order.talentChosenId._id.toString() !== userId) throw new AuthFailureError("You are not authorized to start work on this order");

        //2. Start work
        order.status = "in_progress";
        order.save();


        return {
            order,
        };
    }


    // Talent delivers product 
    static deliverOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId);
        const order = await Order.findById(orderId).populate("talentChosenId", "stageName avatar")
            .populate("memberId", "fullName avatar")
            .populate("commissionServiceId", "title");;
        if (!user) throw new NotFoundError("User not found");
        if (!order) throw new NotFoundError("Order not found");
        if (order.status !== "confirmed") throw new BadRequestError("Order is not confirmed yet");
        if (order.talentChosenId._id.toString() !== userId) throw new AuthFailureError("You are not authorized to start work on this order");

        //2. Start work
        order.status = "in_progress";
        order.save();


        return {
            order,
        };
    }

    // Client confirm finishing order
    static finishOrder = async (userId, orderId) => {
       
    }
}

export default OrderService