import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import postCategoryController from '../../controllers/postCategory.controller.js'

const router = express.Router()

router.get('/readPostCategories/:talentId',asyncHandler(postCategoryController.readPostCategories))

//authentication
router.use(verifyToken)

router.post('/createPostCategory', asyncHandler(postCategoryController.createPostCategory))
router.patch('/updatePostCategory/:postCategoryId', asyncHandler(postCategoryController.updatePostCategory))
router.delete('/deletePostCategory/:postCategoryId', asyncHandler(postCategoryController.deletePostCategory))

export default router
