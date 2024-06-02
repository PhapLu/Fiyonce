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
        console.log(req.body)
        try {
            const { tokens, user } = await AccessService.login(req.body);
            // Setting accessToken in a cookie
            // res.cookie("accessToken", tokens.accessToken, {
            //     httpOnly: true,
            //     maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
            // });
            new SuccessResponse({
                message: 'Login Success!',
                metadata: { user, tokens }
            }).send(res);
        } catch (error) {
            next(error); // Pass error to error handler middleware
        }
    }
    logout = async(req, res, next) =>{
        console.log("HERE")
        try {
            // Call the logout service function
            console.log("KEYSTORE:",req.keyStore)
            const keyStore = req.keyStore;
            console.log(keyStore)
            console.log("Req User:", req.user)
            await AccessService.logout(keyStore);
            // Clearing the accessToken cookie
            res.clearCookie("accessToken", {
                sameSite: "none",
                secure: true,
            });
            // Sending success response
            new SuccessResponse({
                message: "User has been logged out."
            }).send(res);
        } catch (error) {
            // Handling errors
            next(error);
        }
    }
    signUp = async(req, res, next) =>{
        console.log(req.body)
        try {
            const { metadata, code } = await AccessService.signUp(req.body);
    
            // If sign up was successful and tokens were generated
            if (code === 201 && metadata.tokens && metadata.tokens.accessToken) {
                const { tokens } = metadata;
                console.log("TOKENS", tokens)
                // Setting accessToken in a cookie
                res.cookie("accessToken", tokens.accessToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
                });
            }
            // Sending response
            new CREATED({
                message: 'Registered!',
                metadata,
                options: {
                    limit: 10
                }
            }).send(res);
        } catch (error) {
            next(error); // Pass error to error handler middleware
        }
    }
}

export default new AccessController()