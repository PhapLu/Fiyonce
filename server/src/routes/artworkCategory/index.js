import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import artworkCategoryController from '../../controllers/artworkCategory.controller.js'

const router = express.Router()

router.get('/readArtworkCategories/:talentId',asyncHandler(artworkCategoryController.readArtworkCategories))

//authentication
router.use(verifyToken)

router.post('/createArtworkCategory', asyncHandler(artworkCategoryController.createArtworkCategory))
router.patch('/updateArtworkCategory/:artworkCategoryId', asyncHandler(artworkCategoryController.updateArtworkCategory))
router.delete('/deleteArtworkCategory/:artworkCategoryId', asyncHandler(artworkCategoryController.deleteArtworkCategory))

export default router
