import express from 'express'
import postController from '../../controllers/post.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import { uploadFields } from '../../configs/multer.config.js'

const router = express.Router()

router.get('/readPost/:postId', asyncHandler(postController.readPost))
router.get('/readPostsOfTalent/:talentId', asyncHandler(postController.readPostsOfTalent))
router.get('/readPostCategoriesWithPosts/:talentId', asyncHandler(postController.readPostCategoriesWithPosts))
router.get('/readArtworks/:talentId', asyncHandler(postController.readArtworks))

//authentication
router.use(verifyToken)
router.post('/createPost', uploadFields, asyncHandler(postController.createPost))
router.post('/createPostWithArtworksId', uploadFields, asyncHandler(postController.createPostWithArtworksId))
router.patch('/updatePost/:postId', uploadFields, asyncHandler(postController.updatePost))
router.delete('/deletePost/:postId', asyncHandler(postController.deletePost))

router.patch('/likePost/:postId', uploadFields, asyncHandler(postController.likePost))
router.patch('/bookmarkPost/:postId', uploadFields, asyncHandler(postController.bookmarkPost))


export default router