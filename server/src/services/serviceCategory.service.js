import ServiceCategory from "../models/serviceCategory.model.js"
import CommissionService from "../models/commissionService.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"

class ServiceCategoryService {
    static createServiceCategory = async (talentId, body) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (talent.role !== "talent")
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")
        if (!talent?.cccd || !talent?.taxCode)
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này")

        //2. Create service
        const serviceCategory = new ServiceCategory({
            title: body.title,
            talentId,
        })
        await serviceCategory.save()
        return {
            serviceCategory,
        }
    }

    static readServiceCategories = async (talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (talent.role !== "talent")
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")

        //2. Find services
        const serviceCategories = await ServiceCategory.find({
            talentId: talentId,
            deletedAt: null
        }).populate("talentId", "stageName avatar");

        return {
            serviceCategories,
        }
    }

    static readServiceCategoriesWithServices = async (talentId) => {
        try {
            // Fetch all service categories
            const serviceCategories = await ServiceCategory.find({
                talentId,
                deletedAt: null
            }).lean()

            // For each category, find associated services
            const categorizedServices = await Promise.all(
                serviceCategories.map(async (category) => {
                    const services = await CommissionService.find({
                        serviceCategoryId: category._id,
                        deletedAt: null,
                    }).lean()

                    return {
                        _id: category._id,
                        title: category.title,
                        commissionServices: services,
                    }
                })
            )

            return { categorizedServices }
        } catch (error) {
            console.error("Error fetching services by category:", error)
            throw new Error("Failed to fetch services by category")
        }
    }
    static updateServiceCategory = async (
        talentId,
        serviceCategoryId,
        body
    ) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const serviceCategory = await ServiceCategory.findOne(
            { _id: serviceCategoryId, deletedAt: null }
        )

        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!serviceCategory) throw new NotFoundError("Không tìm thấy dịch vụ")
        if (serviceCategory.talentId.toString() !== talentId)
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")
        if (!talent?.cccd || !talent?.taxCode)
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này")

        //2. Update Service
        const updatedServiceCategory = await ServiceCategory.findByIdAndUpdate(
            serviceCategoryId,
            { $set: body },
            { new: true }
        )

        return {
            serviceCategory: updatedServiceCategory,
        }
    }

    static deleteServiceCategory = async (talentId, serviceCategoryId) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const serviceCategory = await ServiceCategory.findOne(
            {
                serviceCategoryId, deletedAt: null
            }
        )

        if (!talent) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!serviceCategory) throw new NotFoundError("Không tìm thấy dịch vụ")
        if (serviceCategory.talentId.toString() !== talentId)
            throw new AuthFailureError("Bạn không có quyền thực hiện thao tác này")
        if (!talent?.cccd || !talent?.taxCode)
            throw new BadRequestError("Vui lòng cập nhật mã số thuế của bạn để thực hiện thao tác này")

        // 2. Update the commission services belonging to this category (set deletedAt to current date)
        await CommissionService.updateMany(
            {
                serviceCategoryId: serviceCategoryId, // Find services in the given category
                deletedAt: null // Only update active services (not already deleted)
            },
            {
                $set: { deletedAt: new Date() } // Set deletedAt to the current timestamp
            }
        );

        //3. Delete service
        await ServiceCategory.findByIdAndUpdate({
            serviceCategoryId,
            deletedAt: new Date()
        })

        return {
            message: "Xóa thể loại dịch vụ thành công",
        };
    }
}

export default ServiceCategoryService
