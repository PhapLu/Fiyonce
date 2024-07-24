import dotenv from 'dotenv'
dotenv.config()

import AuthService from "../services/auth.service.js"
import { CREATED, SuccessResponse } from "../core/success.response.js"
class AuthController {
    login = async(req, res, next) =>{
        try {
            const { metadata, code } = await AuthService.login(req.body)
            // If sign up was successful and tokens were generated
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
                message: 'Đăng nhập thành công',
                metadata,
            }).send(res)
        } catch (error) {
            next(error) // Pass error to error handler middleware
        }
    }

    logout = async(req, res, next) =>{
        res.clearCookie("accessToken", {
            sameSite: "none",
            secure: process.env.NODE_ENV === 'production',
        }).status(200).send("Đã đăng xuất")
    }
    
    signUp = async (req, res, next) => {
        try {
            const { metadata, code } = await AuthService.signUp(req.body)
    
            // Sending response
            new CREATED({
                message: 'Đăng kí thành công! Vui lòng điền mã xác nhận được gửi đến email của bạn.',
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
                message: 'Xác thực tài khoản thành công',
                metadata,
            }).send(res)
        } catch (error) {
            next(error) // Pass error to error handler middleware
        }
    }

    forgotPassword = async(req, res, next) => {
        new SuccessResponse({
            message: 'Đã gửi yêu cầu đổi mật khẩu',
            metadata: await AuthService.forgotPassword(req.body)
        }).send(res)
    }

    verifyResetPasswordOtp = async(req, res, next) => {
        new SuccessResponse({
            message: 'Mã xác thực hợp lệ',
            metadata: await AuthService.verifyResetPasswordOtp(req.body)
        }).send(res)
    }
    resetPassword = async(req, res, next) => {
        new SuccessResponse({
            message: 'Đổi mật khẩu thành công',
            metadata: await AuthService.resetPassword(req.body)
        }).send(res)
    }
}

export default new AuthController()