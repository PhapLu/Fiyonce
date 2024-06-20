import { SuccessResponse } from "../core/success.response.js"
import ServiceCategoryService from "../services/serviceCategory.service.js"

class ServiceCategoryController{
    createServiceCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create serviceCategory success!',
            metadata: await ServiceCategoryService.createServiceCategory(req.userId, req.body)
        }).send(res)
    }
    readServiceCategories = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read serviceCategories success!',
            metadata: await ServiceCategoryService.readServiceCategories(req.params.talentId)
        }).send(res)
    }

    updateServiceCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update serviceCategory success!',
            metadata: await ServiceCategoryService.updateServiceCategory(req.userId, req.params.serviceCategoryId, req.body)
        }).send(res)
    }

    deleteServiceCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete serviceCategory success!',
            metadata: await ServiceCategoryService.deleteServiceCategory(req.userId, req.params.serviceCategoryId)
        }).send(res)
    }

}

export default new ServiceCategoryController()