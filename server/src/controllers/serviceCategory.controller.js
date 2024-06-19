import { SuccessResponse } from "../core/success.response.js"
import ServiceCategoryService from "../services/serviceCategory.service.js"

class ServiceCategoryController{
    readServiceCategories = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read services success!',
            metadata: await ServiceCategoryService.readServices(req.params.talentId)
        }).send(res)
    }

    updateServiceCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update service success!',
            metadata: await ServiceCategoryService.updateService(req.userId, req.params.serviceCategoryId, req.body)
        }).send(res)
    }

    deleteServiceCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete service success!',
            metadata: await ServiceCategoryService.deleteService(req.userId, req.params.serviceCategoryId)
        }).send(res)
    }

}

export default new ServiceCategoryController()