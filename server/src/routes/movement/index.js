import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js";
import accessService from '../../services/auth.service.js'
import movementController from '../../controllers/movement.controller.js';
import { uploadFields } from '../../configs/multer.config.js';

const router = express.Router()

router.get('/readMovements', asyncHandler(movementController.readMovements))

//authentication
router.use(verifyToken)

//admin
router.post('/createMovement', uploadFields, accessService.grantAccess('createAny', 'profile'), asyncHandler(movementController.createMovement))
router.patch('/updateMovement/:movementId', uploadFields, accessService.grantAccess('updateAny', 'profile'), asyncHandler(movementController.updateMovement))
router.delete('/deleteMovement/:movementId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(movementController.deleteMovement))

export default router
