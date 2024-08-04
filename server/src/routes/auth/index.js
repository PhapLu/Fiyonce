import express from "express"
import authController from "../../controllers/auth.controller.js"
import passport from 'passport'
import { asyncHandler } from "../../auth/checkAuth.js"
import { authenticationV2 } from "../../auth/authUtils.js"
import { verifyToken } from "../../middlewares/jwt.js"
import '../../configs/passport.config.js'

const router = express.Router()

//signUp
router.post('/users/signUp', asyncHandler(authController.signUp))
router.post('/users/login', asyncHandler(authController.login))
router.post('/users/verifyOtp', asyncHandler(authController.verifyOtp))
router.post('/users/logout', asyncHandler(authController.logout))
router.post('/users/forgotPassword', asyncHandler(authController.forgotPassword))
router.post('/users/verifyResetPasswordOtp', asyncHandler(authController.verifyResetPasswordOtp))
router.patch('/users/resetPassword', asyncHandler(authController.resetPassword))

//Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to your desired route.
    res.redirect('/profile');
  }
);

export default router