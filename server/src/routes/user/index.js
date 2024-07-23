import express from "express"
import userController from "../../controllers/user.controller.js"
import accessService from "../../services/auth.service.js"
import { asyncHandler } from "../../auth/checkAuth.js"
import { verifyToken } from "../../middlewares/jwt.js"

const router = express.Router()

router.get('/readUserProfile/:profileId', asyncHandler(userController.readUserProfile))
router.get('/me', asyncHandler(userController.me))

//authentication
router.use(verifyToken)

//update Role
router.patch('/updateUserProfile/:profileId', asyncHandler(userController.updateProfile))
router.patch('/followUser/:profileId', asyncHandler(userController.followUser))
router.patch('/unFollowUser/:profileId', asyncHandler(userController.unFollowUser))
router.patch('/bookmarkPost/:postId', asyncHandler(userController.bookmarkPost))
router.delete('/delete/:profileId', asyncHandler(userController.deleteProfile))

export default router