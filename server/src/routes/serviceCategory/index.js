import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import serviceCategoryController from '../../controllers/serviceCategory.controller.js'

const router = express.Router()

router.get('/readServiceCategories/:talentId',asyncHandler(serviceCategoryController.readServiceCategories))
router.get('/readServiceCategoriesWithServices/:talentId',asyncHandler(serviceCategoryController.readServiceCategoriesWithServices))

//authentication
router.use(verifyToken)
router.post('/createServiceCategory', asyncHandler(serviceCategoryController.createServiceCategory))
router.patch('/updateServiceCategory/:serviceCategoryId',asyncHandler(serviceCategoryController.updateServiceCategory))
router.delete('/deleteServiceCategory/:serviceCategoryId',asyncHandler(serviceCategoryController.deleteServiceCategory))

export default router
