import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js";
import serviceController from '../../controllers/service.controller.js';

const router = express.Router()

router.get('/readService/:serviceId', asyncHandler(serviceController.readService))
router.get('/readServices/:talentId', asyncHandler(serviceController.readServices))

//authentication
router.use(verifyToken)

router.post('/createService', asyncHandler(serviceController.createService))
router.patch('/updateService/:serviceId', asyncHandler(serviceController.updateService))
router.delete('/deleteService/:serviceId', asyncHandler(serviceController.deleteService))

export default router
