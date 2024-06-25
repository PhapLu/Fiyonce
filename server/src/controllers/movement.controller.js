import { SuccessResponse } from "../core/success.response.js"
import MovementService from "../services/movement.service.js"

class MovementController{
    createMovement = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create movements success!',
            metadata: await MovementService.createMovement(req.userId, req)
        }).send(res)
    }

    readMovements = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read movements success!',
            metadata: await MovementService.readMovements()
        }).send(res)
    }

    updateMovement = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update movement success!',
            metadata: await MovementService.updateMovement(req.userId, req.params.movementId, req)
        }).send(res)
    }

    deleteMovement = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete movement success!',
            metadata: await MovementService.deleteMovement(req.userId, req.params.movementId)
        }).send(res)
    }
}

export default new MovementController()