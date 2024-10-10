import express from "express";
import authController from "../../controllers/auth.controller.js";
import passport from "passport";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import { verifyToken } from "../../middlewares/jwt.js";
import "../../configs/passport.config.js";

const router = express.Router();

//signUp
router.post("/users/signUp", asyncHandler(authController.signUp));
router.post("/users/login", asyncHandler(authController.login));
router.post("/users/verifyOtp", asyncHandler(authController.verifyOtp));
router.post("/users/logout", asyncHandler(authController.logout));
router.post("/users/forgotPassword",asyncHandler(authController.forgotPassword));
router.post("/users/verifyResetPasswordOtp",asyncHandler(authController.verifyResetPasswordOtp));
router.patch("/users/resetPassword",asyncHandler(authController.resetPassword));

//Google OAuth Routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/users/login" }),
    async (req, res, next) => {
        try {
            const { user } = req;
            if (user && user.accessToken) {
                res.cookie("accessToken", user.accessToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 * 30,
                });
            }

            res.redirect("http://localhost:3000");
        } catch (error) {
            next(error);
        }
    },
    (err, req, res, next) => {
        console.error("Error during Google OAuth callback:", err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to obtain access token",
            error: err.message,
        });
    }
);

export default router;
