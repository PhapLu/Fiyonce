import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import { verifyToken } from "../../middlewares/jwt.js";
const router = express.Router()
//signUp
router.post('/users/signUp', asyncHandler(accessController.signUp))
router.post('/users/login', asyncHandler(accessController.login))
router.patch('/users/verify', asyncHandler(accessController.verifyOtp))
//authentication
//router.use(authenticationV2)
router.use(verifyToken)
//logout
router.post('/users/logout', asyncHandler(accessController.logout))
router.post('/users/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))
export default router