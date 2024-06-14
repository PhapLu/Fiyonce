import { SuccessResponse } from "../core/success.response.js"
import Service from "../services/service.service.js"

class ServiceController{
    createService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create service success!',
            metadata: await Service.createService(req.userId, req.body)
        }).send(res)
    }

    readService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read service success!',
            metadata: await Service.readService(req.params.serviceId)
        }).send(res)
    }

    readServices = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read services success!',
            metadata: await Service.readServices(req.params.talentId)
        }).send(res)
    }

    updateService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update service success!',
            metadata: await Service.updateService(req.userId, req.params.serviceId, req.body)
        }).send(res)
    }

    deleteService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete service success!',
            metadata: await Service.deleteService(req.userId, req.params.serviceId)
        }).send(res)
    }

}

export default new ServiceController()