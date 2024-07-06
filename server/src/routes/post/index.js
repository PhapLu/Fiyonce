import express from 'express'
import postController from '../../controllers/post.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import { uploadFields } from '../../configs/multer.config.js'

const router = express.Router()

router.get('/readPost/:postId', asyncHandler(postController.readPost))
router.get('/readPostsOfTalent/:talentId', asyncHandler(postController.readPostsOfTalent))

//authentication
router.use(verifyToken)

router.post('/createPost', uploadFields, asyncHandler(postController.createPost))
router.patch('/updatePost/:postId', uploadFields, asyncHandler(postController.updatePost))
router.delete('/deletePost/:postId', asyncHandler(postController.deletePost))

export default router