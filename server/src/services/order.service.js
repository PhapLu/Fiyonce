import Order from "../models/order.model.js";
import Artwork from "../models/artwork.model.js";
import Proposal from "../models/proposal.model.js";
import CommissionService from "../models/commissionService.model.js";
import { User } from "../models/user.model.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";
import {
    compressAndUploadImage,
    extractPublicIdFromUrl,
    deleteFileByPublicId,
} from "../utils/cloud.util.js";
import brevoSendEmail from "../configs/brevo.email.config.js";
import mongoose from "mongoose";

class OrderService {
    //Order CRUD
    static createOrder = async (userId, req) => {
        //1. Get type and talentChosenId
        const body = req.body;
        const { isDirect, talentChosenId, commissionServiceId } = body;
        const commissionService = await CommissionService.findById(
            commissionServiceId
        );

        //2. Check isDirect of order
        if (isDirect == 'true') {
            //Direct order
            const talent = await User.findById(talentChosenId);
            const service = await CommissionService.findById(
                commissionServiceId
            );

            if (!talent) throw new BadRequestError("Họa sĩ không tồn tại");
            if (!service)
                throw new BadRequestError("Dịch vụ không tồn tại");
            if (talent.role != "talent")
                throw new AuthFailureError("Người này không phải là họa sĩ");
            if (talent._id.toString() == userId)
                throw new BadRequestError("Bạn không thể tạo đơn hàng với bản thân");
            body.isDirect = true;
            body.talentChosenId = talentChosenId;
            body.commissionServiceId = commissionServiceId;
        } else {
            //InDirect order
            body.isDirect = false;
            body.talentChosenId = null;
        }
        if(parseInt(body.minPrice) < commissionService.minPrice)
            throw new BadRequestError("Giá tối thiểu không thể nhỏ hơn giá tối thiểu của dịch vụ");
        if(parseInt(body.maxPrice) < parseInt(body.minPrice))
            throw new BadRequestError("Giá tối đa không thể nhỏ hơn giá tối thiểu");

        //3. Upload req.files.files to cloudinary
        try {
            let references = [];

            if (req.files && req.files.files && req.files.files.length > 0) {
                const uploadPromises = req.files.files.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/order/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                );
                const uploadResults = await Promise.all(uploadPromises);
                references = uploadResults.map((result) => result.secure_url);
            }

            //4. Create order
            const order = new Order({
                memberId: userId,
                references,
                ...body,
            });
            await order.save();

            return {
                order,
            };
        } catch (error) {
            console.log("Error uploading images or saving order:", error);
            throw new BadRequestError("Tạo đơn hàng không thành công");
        }
    };

    static readOrder = async (orderId) => {
        const order = await Order.findById(orderId).populate(
            "talentChosenId",
            "stageName avatar fullName"
        );
        if (!order) throw new NotFoundError("Đơn hàng không tồn tại");

        return {
            order,
        };
    };

    //Client read approved indirect orders in commission market
    static readOrders = async (req) => {
        const q = req.query;
        const filters = {
            isMemberArchived: false,
            ...(q.isDirect !== undefined && { isDirect: q.isDirect === 'true' }),
        };

        //1. Get all orders
        const orders = await Order.find(filters)
            .sort({ createdAt: -1 }) // Sort orders by createdAt in descending order
            .populate("talentChosenId", "fullName avatar")
            .populate("memberId", "fullName avatar");

        //2. Iterate over each order to add talentsApprovedCount
        const ordersWithCounts = await Promise.all(
            orders.map(async (order) => {
                const talentsApprovedCount = await Proposal.find({
                    orderId: order._id,
                    status: "approved",
                }).countDocuments();
                order._doc.talentsApprovedCount = talentsApprovedCount; // Add the count to the order
                return order;
            })
        );

        return {
            orders: ordersWithCounts,
        };
    };

    static updateOrder = async (userId, orderId, req) => {
        //1. check order and user
        const oldOrder = await Order.findById(orderId);
        const foundUser = await User.findById(userId);
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!oldOrder) throw new NotFoundError("Đơn hàng không tồn tại");
        if (oldOrder.memberId.toString() !== userId)
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");
        
        //2. Validate body
        const body = req.body;
        if(body.commissionServiceId || body.talentChosenId || body.memberId || body.status || body.isDirect || body.references || body.isTalentArchived)
            throw new BadRequestError("Không thể cập nhật các trường này");
        if(parseInt(body.minPrice) > parseInt(body.maxPrice))
            throw new BadRequestError("Giá tối thiểu không thể lớn hơn giá tối đa");
        
        //3. Check order status
        if (oldOrder.status != "pending")
            throw new BadRequestError("Bạn không thể cập nhật đơn hàng ở bước này");
        
        //4. Handle file uploads if new files were uploaded
        try {
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
                );
                const uploadResults = await Promise.all(uploadPromises);
                const references = uploadResults.map(
                    (result) => result.secure_url
                );
                body.references = references;

                //Delete old images from cloudinary
                const publicIds = oldOrder.references.map((reference) =>
                    extractPublicIdFromUrl(reference)
                );
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                );
            }

            //5. Merge existing service fields with body to ensure fields not provided in body are retained
            const updatedFields = { ...oldOrder.toObject(), ...body };

            //6. update Order
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                updatedFields,
                { new: true }
            );
            
            //7. Send email to talent
            //await brevoSendEmail(foundUser.email, 'Order rejected', 'Your order has been rejected by talent')

            return {
                order: updatedOrder,
            };
        } catch (error) {
            console.log("Error in updating commission service:", error);
            throw new Error("Cập nhật đơn hàng không thành công");
        }
    };
    //End Order CRUD

    static readMemberOrderHistory = async (clientId) => {
        //1. Check user
        const foundUser = await User.findById(clientId);
        if (!foundUser) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");

        //2. Get orders
        const orders = await Order.find({ memberId: clientId }).populate(
            "talentChosenId",
            "stageName fullName avatar"
        );

        return {
            memberOrderHistory: orders,
        };
    };

    static readTalentOrderHistory = async (talentId) => {
        // 1. Check if the talent exists and is of role 'talent'
        const foundTalent = await User.findById(talentId);
        if (!foundTalent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (foundTalent.role !== "talent")
            throw new BadRequestError("Bạn không phải là họa sĩ");

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
                        proposalId: "$proposalId._id",
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
            ]);

            return { talentOrderHistory: orders };
        } catch (error) {
            console.error("Error fetching orders by talent:", error);
            throw new BadRequestError('Lỗi khi lấy thông tin đơn hàng của họa sĩ');
        }
    };

    static readArchivedOrderHistory = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        
        //2. Get archived orders
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
            ]);

            return { 
                archivedOrderHistory: orders 
            };
        } catch (error) {
            console.error("Error fetching archived orders:", error);
            throw new BadRequestError('Lỗi khi lấy thông tin đơn hàng đã lưu trữ');
        }
    };

    static archiveOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId);
        const order = await Order.findById(orderId);
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!order) throw new NotFoundError("Đơn hàng không tồn tại");

        //2. Archive order
        if (userId == order.memberId.toString()) {
            order.isMemberArchived = true;
        } else {
            order.isTalentArchived = true;
        }
        order.save();

        return {
            order,
        };
    };
    static unarchiveOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId);
        const order = await Order.findById(orderId);
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!order) throw new NotFoundError("Đơn hàng không tồn tại");

        if (userId == order.memberId.toString()) {
            order.isMemberArchived = false;
        } else {
            order.isTalentArchived = false;
        }

        order.save();

        return {
            order,
        };
    };

    static rejectOrder = async (userId, orderId) => {
        //1. Check if user, order exists
        const user = await User.findById(userId);
        const order = await Order.findById(orderId);
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
        if (!order) throw new NotFoundError("Đơn hàng không tồn tại");

        //2. Check if user is authorized to deny order
        if (user.role !== "talent")
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này");

        //3. Check if order status is pending
        if (order.status !== "pending")
            throw new BadRequestError("Bạn không thể từ chối đơn hàng ở bước này");

        //4. Deny order
        order.status = "rejected";
        order.save();

        //5. Show order
        const deniedOrder = order.populate(
            "talentChosenId",
            "stageName avatar fullName"
        );

        //6. Send email to user
        // try {
        //     await brevoSendEmail(user.email, 'Order rejected', 'Your order has been rejected by talent')
        // } catch (error) {
        //     throw new Error('Email service error')
        // }

        return {
            order: deniedOrder,
        };
    };
    // static deleteOrder = async(userId, orderId) => {
    //     //1. Check user and order
    //     const foundUser = await User.findById(userId)
    //     const order = await Order.findById(orderId)
    //     if(!foundUser) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')
    //     if(!order) throw new NotFoundError('Đơn hàng không tồn tại')
    //     if(foundUser._id != order.memberId.toString()) throw new AuthFailureError('You can delete only your order!')

    //     //2. Check order status
    //     if(oldOrder.status != 'pending' && oldOrder.status != 'approved')
    //         throw new BadRequestError('You cannot delete order on this stage!')

    //     //3. Extract public IDs and delete files from Cloudinary
    //     const publicIds = order.references.map(reference => extractPublicIdFromUrl(reference))
    //     await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)))

    //     //4. Delete order
    //     await order.deleteOne()

    //     return{
    //         message: 'Order deleted successfully!'
    //     }
    // }
}

export default OrderService;
