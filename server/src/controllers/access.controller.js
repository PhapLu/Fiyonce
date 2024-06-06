import AccessService from "../services/access.service.js";
import { CREATED, SuccessResponse } from "../core/success.response.js";
class AccessController {
    handlerRefreshToken = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        })
    }

    login = async(req, res, next) =>{
        try {
            const { metadata, code } = await AccessService.login(req.body);
            // If sign up was successful and tokens were generated
            if (code === 200 && metadata.user && metadata.user.accessToken) {
                const { accessToken } = metadata.user;
                // Setting accessToken in a cookie
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
                });
            }
            // Sending response
            new SuccessResponse({
                message: 'Registered!',
                metadata,
            }).send(res);
        } catch (error) {
            next(error); // Pass error to error handler middleware
        }
    }
    // logout = async(req, res, next) =>{
    //     try {
    //         // Call the logout service function
    //         console.log("KEYSTORE:",req.keyStore)
    //         const keyStore = req.keyStore;
    //         console.log(keyStore)
    //         console.log("Req User:", req.user)
    //         await AccessService.logout(keyStore);
    //         // Clearing the accessToken cookie
    //         res.clearCookie("accessToken", {
    //             sameSite: "none",
    //             secure: true,
    //         });
    //         // Sending success response
    //         new SuccessResponse({
    //             message: "User has been logged out."
    //         }).send(res);
    //     } catch (error) {
    //         // Handling errors
    //         next(error);
    //     }
    // }
    logout = async(req, res, next) =>{
        res.clearCookie("accessToken", {
            sameSite: "none",
            secure: true,
        }).status(200).send("User has been logged out.")
    }
    
    signUp = async (req, res, next) => {
        try {
            const { metadata, code } = await AccessService.signUp(req.body);
    
            // Sending response
            new CREATED({
                message: 'Registered! Please check your email for the OTP to verify your account.',
                metadata,
            }).send(res);
        } catch (error) {
            next(error); // Pass error to error handler middleware
        }
    }

    verifyOtp = async (req, res, next) => {
        try {
            const { metadata, code } = await AccessService.verifyOtp(req.body);
    
            // If OTP verification was successful and tokens were generated
            if (code === 200 && metadata.user && metadata.user.accessToken) {
                const { accessToken } = metadata.user;
                // Setting accessToken in a cookie
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
                });
            }
    
            // Sending response
            new SuccessResponse({
                message: 'Account verified successfully!',
                metadata,
            }).send(res);
        } catch (error) {
            next(error); // Pass error to error handler middleware
        }
    }

    forgotPassword = async(req, res, next) => {
        new SuccessResponse({
            message: 'Forgot password success!',
            metadata: await AccessService.forgotPassword(req.body)
        }).send(res)
    }

    verifyResetPasswordOtp = async(req, res, next) => {
        new SuccessResponse({
            message: 'Forgot password success!',
            metadata: await AccessService.verifyResetPasswordOtp(req.body)
        }).send(res)
    }
    // resetPassword = async(req, res, next) => {
    //     try {
    //         const { metadata, code } = await AccessService.resetPassword(req.body);

    //         // If OTP verification was successful and tokens were generated
    //         if (code === 200 && metadata.user && metadata.user.accessToken) {
    //             const { accessToken } = metadata.user;
    //             // Setting accessToken in a cookie
    //             res.cookie("accessToken", accessToken, {
    //                 httpOnly: true,
    //                 maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
    //             });
    //         }
    //         new SuccessResponse({
    //             message: 'Forgot password success!',
    //             metadata,
    //         }).send(res)
    //     } catch (error) {
    //         next(error); // Pass error to error handler middleware
    //     }
    // }
    
}

export default new AccessController()