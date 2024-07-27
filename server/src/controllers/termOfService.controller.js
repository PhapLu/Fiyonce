import { SuccessResponse } from "../core/success.response.js"
import TermOfServiceService from "../services/termOfService.service.js"

class TermOfServiceController{
    createTermOfService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create termOfService success!',
            metadata: await TermOfServiceService.createTermOfService(req.userId, req.body)
        }).send(res)
    }

    readTermOfServices = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read termOfServices success!',
            metadata: await TermOfServiceService.readTermOfServices(req.userId)
        }).send(res)
    }

    readTermOfService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read termOfServices success!',
            metadata: await TermOfServiceService.readTermOfService(req.params.termOfServiceId)
        }).send(res)
    }
    
    updateTermOfService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update termOfService success!',
            metadata: await TermOfServiceService.updateTermOfService(req.userId, req.params.termOfServiceId, req.body)
        }).send(res)
    }

    deleteTermOfService = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete termOfService success!',
            metadata: await TermOfServiceService.deleteTermOfService(req.userId, req.params.termOfServiceId)
        }).send(res)
    }
}

export default new TermOfServiceController()