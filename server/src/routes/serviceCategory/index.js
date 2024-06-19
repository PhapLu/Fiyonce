import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js";
import serviceCategoryController from '../../controllers/serviceCategory.controller.js';

const router = express.Router()

router.post('/readServiceCategories/:talentId',asyncHandler(serviceCategoryController.readServiceCategories))

//authentication
router.use(verifyToken)

router.post('/createServiceCategory', asyncHandler(serviceCategoryController.createServiceCategory))
router.post('/updateServiceCategory/:serviceCategoryId',asyncHandler(serviceCategoryController.updateServiceCategory))
router.post('/deleteServiceCategory/:serviceCategoryId',asyncHandler(serviceCategoryController.deleteServiceCategory))

export default router
