import dotenv from 'dotenv'
dotenv.config()

import AuthService from "../services/auth.service.js"
import { CREATED, SuccessResponse } from "../core/success.response.js"
class AuthController {
    // handlerRefreshToken = async(req, res, next) =>{
    //     new SuccessResponse({
    //         message: 'Get token success!',
    //         metadata: await AuthService.handlerRefreshToken({
    //             refreshToken: req.refreshToken,
    //             user: req.user,
    //             keyStore: req.keyStore
    //         })
    //     })
    // }

    login = async(req, res, next) =>{
        try {
            const { metadata, code } = await AuthService.login(req.body)
            // If sign up was successful and tokens were generated
            if (code === 200 && metadata.user && metadata.user.accessToken) {
                const { accessToken } = metadata.user
                // Setting accessToken in a cookie
                res.cookie("accessToken", accessToken, {
                    secure: process.env.NODE_ENV === 'product',
                    sameSite: 'none',
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
                })
            }
            // Sending response
            new SuccessResponse({
                message: 'User has been logged in!',
                metadata,
            }).send(res)
        } catch (error) {
            next(error) // Pass error to error handler middleware
        }
    }
    // logout = async(req, res, next) =>{
    //     try {
    //         // Call the logout service function
    //         console.log("KEYSTORE:",req.keyStore)
    //         const keyStore = req.keyStore
    //         console.log(keyStore)
    //         console.log("Req User:", req.user)
    //         await AuthService.logout(keyStore)
    //         // Clearing the accessToken cookie
    //         res.clearCookie("accessToken", {
    //             sameSite: "none",
    //             secure: true,
    //         })
    //         // Sending success response
    //         new SuccessResponse({
    //             message: "User has been logged out."
    //         }).send(res)
    //     } catch (error) {
    //         // Handling errors
    //         next(error)
    //     }
    // }
    logout = async(req, res, next) =>{
        res.clearCookie("accessToken", {
            sameSite: "none",
            secure: process.env.NODE_ENV === 'production',
        }).status(200).send("User has been logged out.")
    }
    
    signUp = async (req, res, next) => {
        try {
            const { metadata, code } = await AuthService.signUp(req.body)
    
            // Sending response
            new CREATED({
                message: 'Registered! Please check your email for the OTP to verify your account.',
                metadata,
            }).send(res)
        } catch (error) {
            next(error) // Pass error to error handler middleware
        }
    }

    verifyOtp = async (req, res, next) => {
        try {
            const { metadata, code } = await AuthService.verifyOtp(req.body)
    
            // If OTP verification was successful and tokens were generated
            if (code === 200 && metadata.user && metadata.user.accessToken) {
                const { accessToken } = metadata.user
                // Setting accessToken in a cookie
                res.cookie("accessToken", accessToken, {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
                })
            }
    
            // Sending response
            new SuccessResponse({
                message: 'Account verified successfully!',
                metadata,
            }).send(res)
        } catch (error) {
            next(error) // Pass error to error handler middleware
        }
    }

    forgotPassword = async(req, res, next) => {
        new SuccessResponse({
            message: 'Forgot password success!',
            metadata: await AuthService.forgotPassword(req.body)
        }).send(res)
    }

    verifyResetPasswordOtp = async(req, res, next) => {
        new SuccessResponse({
            message: 'Forgot password success!',
            metadata: await AuthService.verifyResetPasswordOtp(req.body)
        }).send(res)
    }
    resetPassword = async(req, res, next) => {
        new SuccessResponse({
            message: 'Reset password success!',
            metadata: await AuthService.resetPassword(req.body)
        }).send(res)
    }
}

export default new AuthController()