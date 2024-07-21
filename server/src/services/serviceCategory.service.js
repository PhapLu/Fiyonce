import ServiceCategory from "../models/serviceCategory.model.js";
import CommissionService from "../models/commissionService.model.js";
import { User } from "../models/user.model.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";

class ServiceCategoryService {
    static createServiceCategory = async (talentId, body) => {
        //1. Check talent
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Talent not found");
        if (talent.role !== "talent")
            throw new BadRequestError("He/She is not a talent");

        //2. Create service
        const serviceCategory = new ServiceCategory({
            title: body.title,
            talentId,
        });
        await serviceCategory.save();
        return {
            serviceCategory,
        };
    };

    static readServiceCategories = async (talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Talent not found");
        if (talent.role !== "talent")
            throw new BadRequestError("He/She is not a talent");

        //2. Find services
        const serviceCategories = await ServiceCategory.find({
            talentId: talentId,
        }).populate("talentId", "stageName avatar");

        return {
            serviceCategories,
        };
    };

    static readServiceCategoriesWithServices = async (talentId) => {
        try {
            // Fetch all service categories
            const serviceCategories = await ServiceCategory.find({
                talentId,
            }).lean();

            // For each category, find associated services
            const categorizedServices = await Promise.all(
                serviceCategories.map(async (category) => {
                    const services = await CommissionService.find({
                        serviceCategoryId: category._id,
                    }).lean();

                    return {
                        _id: category._id,
                        title: category.title,
                        commissionServices: services,
                    };
                })
            );

            return { categorizedServices };
        } catch (error) {
            console.error("Error fetching services by category:", error);
            throw new Error("Failed to fetch services by category");
        }
    };
    static updateServiceCategory = async (
        talentId,
        serviceCategoryId,
        body
    ) => {
        //1. Check talent and service
        const talent = await User.findById(talentId);
        const serviceCategory = await ServiceCategory.findById(
            serviceCategoryId
        );

        if (!talent) throw new NotFoundError("Talent not found");
        if (!serviceCategory) throw new NotFoundError("Service not found");
        if (serviceCategory.talentId.toString() !== talentId)
            throw new AuthFailureError("You can only update your service");

        //2. Update Service
        const updatedServiceCategory = await ServiceCategory.findByIdAndUpdate(
            serviceCategoryId,
            { $set: body },
            { new: true }
        );

        return {
            serviceCategory: updatedServiceCategory,
        };
    };

    static deleteServiceCategory = async (talentId, serviceCategoryId) => {
        //1. Check talent and service
        const talent = await User.findById(talentId);
        const serviceCategory = await ServiceCategory.findById(
            serviceCategoryId
        );

        if (!talent) throw new NotFoundError("Talent not found");
        if (!serviceCategory) throw new NotFoundError("Service not found");
        if (serviceCategory.talentId.toString() !== talentId)
            throw new AuthFailureError("You can only delete your service");

        //2. Delete service
        return await serviceCategory.deleteOne();
    };
}

export default ServiceCategoryService;
