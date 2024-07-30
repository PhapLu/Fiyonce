import express from 'express'
import accessService from '../../services/auth.service.js'
import newsController from '../../controllers/news.controller.js'
import { uploadFields } from '../../configs/multer.config.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"

const router = express.Router()

router.get('/readNews/:newsId', asyncHandler(newsController.readNews))
router.get('/readNewss', asyncHandler(newsController.readNewss))

//authentication
router.use(verifyToken)

//admin
router.post('/createNews', uploadFields, accessService.grantAccess('createAny', 'profile'), asyncHandler(newsController.createNews))
router.patch('/updateNews/:newsId', uploadFields, accessService.grantAccess('updateAny', 'profile'), asyncHandler(newsController.updateNews))
router.delete('/deleteNews/:newsId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(newsController.deleteNews))

export default router
