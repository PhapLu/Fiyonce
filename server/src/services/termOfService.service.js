import TermOfService from "../models/termOfService.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

class TermOfServiceService {
    static createTermOfService = async (userId, body) => {
        //1. Check if user is an talent
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== "talent")
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")

        //2. Validate body
        const { content } = body
        if (!content) throw new BadRequestError("Hãy nhập đầy đủ những thông tin cần thiết")

        //3. Create termOfService
        const termOfService = new TermOfService({
            talentId: userId,
            ...body,
        })
        await termOfService.save()

        return {
            termOfService,
        }
    }

    static readTermOfService = async (termOfServiceId) => {
        //1. Check if termOfService exists
        const termOfService = await TermOfService.findById(termOfServiceId)
        if (!termOfService) throw new NotFoundError("Không tìm thấy ToS")

        return {
            termOfService,
        }
    }

    static readTermOfServices = async (talentId) => {
        // Use aggregation to fetch TermOfServices and the related CommissionServices
        const termOfServices = await TermOfService.aggregate([
            { $match: { talentId: new mongoose.Types.ObjectId(talentId) } },
            {
                $lookup: {
                    from: "CommissionServices",
                    localField: "_id",
                    foreignField: "termOfServiceId",
                    as: "commissionServices",
                },
            },
        ])

        return {
            termOfServices,
        }
    }

    static updateTermOfService = async (userId, termOfServiceId, body) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== "talent")
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")

        //2. Check if termOfService exists
        const termOfService = await TermOfService.findById(termOfServiceId)
        if (!termOfService) throw new NotFoundError("Không tìm thấy ToS")
        if (termOfService.talentId.toString() !== userId)
            throw new BadRequestError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        //3. Update termOfService
        const updatedTermOfService = await TermOfService.findByIdAndUpdate(
            termOfServiceId,
            body,
            { new: true }
        )

        return {
            termOfService: updatedTermOfService,
        }
    }

    static deleteTermOfService = async (userId, termOfServiceId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== "talent")
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")

        //2. Check if termOfService exists
        const termOfService = await TermOfService.findById(termOfServiceId)
        if (!termOfService) throw new NotFoundError("Không tìm thấy ToS")
        if (termOfService.talentId.toString() !== userId)
            throw new BadRequestError(
                "Bạn không có quyền thực hiện thao tác này"
            )

        //3. Delete termOfService
        await TermOfService.findByIdAndDelete(termOfServiceId)

        return {
            message: "Xóa ToS thành công",
        }
    }
}

export default TermOfServiceService
