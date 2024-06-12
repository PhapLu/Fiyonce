import express from "express";
import authController from "../../controllers/auth.controller.js";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import { verifyToken } from "../../middlewares/jwt.js";
const router = express.Router()
//signUp
router.post('/users/signUp', asyncHandler(authController.signUp))
router.post('/users/login', asyncHandler(authController.login))
router.post('/users/verifyOtp', asyncHandler(authController.verifyOtp))
router.post('/users/logout', asyncHandler(authController.logout))
router.post('/users/forgotPassword', asyncHandler(authController.forgotPassword))
router.post('/users/verifyResetPasswordOtp', asyncHandler(authController.verifyResetPasswordOtp))
router.patch('/users/resetPassword', asyncHandler(authController.resetPassword))
//authentication
//router.use(authenticationV2)
router.use(verifyToken)
//router.post('/users/handlerRefreshToken', asyncHandler(authController.handlerRefreshToken))
export default router