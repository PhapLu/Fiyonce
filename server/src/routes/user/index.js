import express from "express";
import userController from "../../controllers/user.controller.js";
import accessService from "../../services/auth.service.js";
import { asyncHandler } from "../../auth/checkAuth.js";
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()

router.get('/readUserProfile/:profileId', asyncHandler(userController.readUserProfile))
router.get('/me', asyncHandler(userController.me))

//authentication
router.use(verifyToken)

//update Role
router.patch('/updateUserProfile/:id', accessService.grantAccess('updateOwn', 'profile'), asyncHandler(userController.updateProfile))
router.post('/addToBookmarks/:artworkId', accessService.grantAccess('updateOwn', 'profile'), asyncHandler(userController.addToBookmark))
router.delete('/delete:profileId', accessService.grantAccess('deleteOwn', 'profile'), asyncHandler(userController.deleteProfile))

export default router