import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import role from "../middlewares/role.js"
import sendEmail from "../middlewares/sendMail.js"
import KeyTokenService from "./keyToken.service.js"
import Key from "../models/keyToken.model.js"
import ForgotPasswordOTP from "../models/forgotPasswordOTP.model.js"
import UserOTPVerification from "../models/userOTPVerification.model.js"
import { User } from "../models/user.model.js"
import { createTokenPair, verifyJWT } from "../auth/authUtils.js"
import { findByEmail} from '../utils/index.js'
import { AuthFailureError, BadRequestError, ForbiddenError} from "../core/error.response.js"
import { createUserQRCode } from "../utils/qrcode.util.js"
import sendEmailSES from '../utils/email.util.js'

class AuthService {
    /*
        1. check email in dbs,
        2. match password
        3. create AccessToken and RefreshToken and save
        4. generate tokens
        5. get data and  return login 
     */
    // static login = async({email, password, refreshToken = null}) => {
    //     // 1. Check email in the database
    //     const foundUser = await User.findOne({email}).lean()
    //     if (!foundUser) throw new BadRequestError("User not registered")

    //     // 2. Match password
    //     const match = await bcrypt.compare(password, foundUser.password) // Await the bcrypt comparison
    //     if (!match) throw new AuthFailureError("Authentication error")

    //     // 3. Exclude password from foundUser
    //     const { password: hiddenPassword, ...userWithoutPassword } = foundUser

    //     // 4. Create AccessToken and RefreshToken and save
    //     const privateKey = crypto.randomBytes(64).toString("hex")
    //     const publicKey = crypto.randomBytes(64).toString("hex")

    //     // 5. Generate tokens
    //     const { _id: userId } = foundUser
    //     const tokens = await createTokenPair(
    //         userWithoutPassword,
    //         publicKey,
    //         privateKey
    //     )
    //     await KeyTokenService.createKeyToken({
    //         refreshToken: tokens.refreshToken,
    //         privateKey,
    //         publicKey,
    //         userId
    //     })

    //     // 6. Return user data and tokens
    //     return {
    //         user: userWithoutPassword,
    //         tokens
    //     }
    // }


    // static signUp = async({fullname, email, password}) =>{
    //     //1. check if email exists?
    //     const holderUser = await User.findOne({ email }).lean()
    //     if(holderUser) {
    //         throw new BadRequestError("Error: User already registered")
    //     }
    //     const hashedPassword = await bcrypt.hash(password, 10)
    //     const newUser = await User.create({
    //         fullname,
    //         email,
    //         password: hashedPassword,
    //         role: RoleUser.MEMBER
    //     })
    //     const { password: hiddenPassword, ...userWithoutPassword } = newUser
    //     if(newUser){
    //         //This is for a giant system like  AMAZON,..., we gonna use 'Crypto' for this
    //         // created privateKey, publicKey
    //         // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    //         //     modulusLength: 4096,
    //         //     publicKeyEncoding:{
    //         //         type: 'pkcs1',
    //         //         format: 'pem'
    //         //     },
    //         //     privatekeyEncoding:{
    //         //         type: 'pkcs1',
    //         //         format: 'pem'
    //         //     }
    //         // })
    //         //This is for our web app, it's still good and it is suitable for medium system
    //         const privateKey = crypto.randomBytes(64).toString("hex")
    //         const publicKey = crypto.randomBytes(64).toString("hex")
    //         //Public key cryptoGraphy Standards
    //         console.log("publicKey: ", publicKey)
    //         const keyStore = await KeyTokenService.createKeyToken({
    //             userId: newUser._id,
    //             publicKey,
    //             privateKey
    //         })

    //         if(!keyStore) {
    //             throw new BadRequestError("Error: publicKeyString error!")
    //         }
    //         //created token pair
    //         const tokens = await createTokenPair(
    //             {userId: newUser._id, email, role: newUser.role},
    //             publicKey,
    //             privateKey
    //         )
    //         return {
    //             code: 201,
    //             metadata: {
    //                 user: userWithoutPassword,
    //                 tokens
    //             }
    //         }
    //     }

    //     return {
    //         code: 200,
    //         metadata: null
    //     }
    // }
    static login = async ({ email, password }) => {
        // 1. Check email in the database
        const foundUser = await User.findOne({ email }).lean()
        if (!foundUser) throw new BadRequestError("User not registered")

        // 2. Match password
        const match = await bcrypt.compare(password, foundUser.password) // Await the bcrypt comparison
        if (!match) throw new AuthFailureError("Authentication error")

        // 3. Exclude password from foundUser

        const token = jwt.sign(
            {
                id: foundUser._id,
                email: foundUser.email
            },
            process.env.JWT_SECRET
        )
        foundUser.accessToken = token
        const { password: hiddenPassword, ...userWithoutPassword } = foundUser
        return {
            code: 200,
            metadata: {
                user: userWithoutPassword
            }
        }
    }

    static signUp = async ({ fullName, email, password }) => {
        // 1. Check if email exists
        const holderUser = await User.findOne({ email }).lean()
        if (holderUser) {
            throw new BadRequestError("Error: User already registered")
        }
    
        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
    
        // 3. Check if there is an existing OTP record for the email
        const oldOtp = await UserOTPVerification.findOne({ email }).lean()
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set to the start of the day
    
        let otp
        let otpVerification
        if (oldOtp) {
            const lastRequestDate = new Date(oldOtp.lastRequestDate)
            lastRequestDate.setHours(0, 0, 0, 0) // Set to the start of the day
    
            if (lastRequestDate.getTime() === today.getTime()) {
                // Same day request
                if (oldOtp.requestCount >= 10) {
                    throw new BadRequestError("Error: OTP request limit reached for today")
                } else {
                    // Increment request count and generate new OTP
                    otp = crypto.randomInt(100000, 999999).toString()
                    otpVerification = await UserOTPVerification.updateOne({ email }, { 
                        $inc: { requestCount: 1 },
                        $set: { otp, expiredAt: new Date(Date.now() + 30 * 60 * 1000), lastRequestDate: new Date() }
                    })
                }
            } else {
                // Different day request, reset count and generate new OTP
                otp = crypto.randomInt(100000, 999999).toString()
                otpVerification = await UserOTPVerification.updateOne({ email }, { 
                    $set: { requestCount: 1, lastRequestDate: new Date(), otp, expiredAt: new Date(Date.now() + 30 * 60 * 1000) }
                })
            }
        } else {
            // New OTP request
            otp = crypto.randomInt(100000, 999999).toString()
            otpVerification = new UserOTPVerification({
                email,
                password: hashedPassword,
                fullName,
                otp,
                expiredAt: new Date(Date.now() + 30 * 60 * 1000), // OTP expires in 30 minutes
                requestCount: 1,
                lastRequestDate: new Date()
            })
            await otpVerification.save()
        }
    
        // 4. Send OTP email
        const subject = 'Your OTP Code'
        const subjectMessage = `Mã xác thực đăng kí tài khoản của bạn là:`
        const verificationCode = otp
        await sendEmail(email, subject, subjectMessage, verificationCode)
        return {
            code: 201,
            metadata: {
                email: otpVerification.email
            }
        }
    }

    static verifyOtp = async ({ email, otp }) => {
        // 1. Find the OTP in the database
        const otpRecord = await UserOTPVerification.findOne({ email }).lean()
        if (!otpRecord) {
            throw new BadRequestError('OTP not found')
        }

        // 2. Check if the OTP is expired
        if (otpRecord.expiredAt < new Date()) {
            throw new BadRequestError('OTP has expired')
        }

        // 3. Check if the OTP is correct
        if (otpRecord.otp !== otp) {
            throw new BadRequestError('Incorrect OTP')
        }

        //4. Create user by otpVerification
        const newUser = await User.create({
            fullName: otpRecord.fullName,
            email: otpRecord.email,
            password: otpRecord.password,
            role: 'member', // Use the string directly
        })

        //Create qrCode
        const qrCode = await createUserQRCode(newUser._id.toString())
        newUser.qrCode = qrCode
        await newUser.save()

        // 5. Delete the OTP record
        await UserOTPVerification.deleteOne({ email })

        // 6. Create token
        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email
            },
            process.env.JWT_SECRET
        )

        newUser.accessToken = token
        await newUser.save()

        const { password: hiddenPassword, ...userWithoutPassword } = newUser.toObject() // Ensure toObject() is used to strip the password
        return {
            code: 200,
            metadata: {
                user: userWithoutPassword
            }
        }
    }

    static forgotPassword = async ({ email }) => {
        // 1. Find the user by email
        const user = await User.findOne({ email }).lean()
        if (!user) {
            throw new BadRequestError('User not found')
        }
    
        const oldOtp = await ForgotPasswordOTP.findOne({ email }).lean()
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set to the start of the day
    
        let otp
        if (oldOtp) {
            const lastRequestDate = new Date(oldOtp.lastRequestDate)
            lastRequestDate.setHours(0, 0, 0, 0) // Set to the start of the day
    
            if (lastRequestDate.getTime() === today.getTime()) {
                // Same day request
                if (oldOtp.requestCount >= 10) {
                    throw new BadRequestError("Error: OTP request limit reached for today")
                } else {
                    // Increment request count and generate new OTP
                    otp = crypto.randomInt(100000, 999999).toString()
                    await ForgotPasswordOTP.updateOne({ email }, { 
                        $inc: { requestCount: 1 },
                        $set: { otp, expiredAt: new Date(Date.now() + 30 * 60 * 1000), lastRequestDate: new Date() }
                    })
                }
            } else {
                // Different day request, reset count and generate new OTP
                otp = crypto.randomInt(100000, 999999).toString()
                await ForgotPasswordOTP.updateOne({ email }, { 
                    $set: { requestCount: 1, lastRequestDate: new Date(), otp, expiredAt: new Date(Date.now() + 30 * 60 * 1000) }
                })
            }
        } else {
            // New OTP request
            otp = crypto.randomInt(100000, 999999).toString()
            const forgotPasswordOTP = new ForgotPasswordOTP({
                email,
                otp,
                expiredAt: new Date(Date.now() + 30 * 60 * 1000), // OTP expires in 30 minutes
                requestCount: 1,
                lastRequestDate: new Date()
            })
            await forgotPasswordOTP.save()
        }
    
        // 3. Send OTP email
        const subject = 'Your OTP Code'
        const subjectMessage = 'Mã xác thực đổi mật khẩu của bạn là: '
        const verificationCode = otp
        await sendEmail(email, subject, subjectMessage, verificationCode)
    
        return {
            code: 200,
            metadata: {
                email
            }
        }
    }

    static verifyResetPasswordOtp = async ({ email, otp }) => {
        //1. Find, check the OTP and user in the database
        const otpRecord = await ForgotPasswordOTP.findOne({ email })
        const user = await User.findOne({ email })

        if (!otpRecord) throw new BadRequestError('OTP not found')
        if (!user) throw new BadRequestError('User not found')
        if (otpRecord.expiredAt < new Date()) throw new BadRequestError('OTP has expired')

        //2. Check if the OTP is correct
        if (otpRecord.otp !== otp) throw new BadRequestError('Incorrect OTP')

        //3. Mark the otp is verified
        otpRecord.isVerified = true
        otpRecord.save()

        return {
            otpRecord
        }
    }

    static resetPassword = async ({ email, password }) => {
        console.log(email, password)
        //1. Find and check the OTP and user in the database
        const otpRecord = await ForgotPasswordOTP.findOne({ email })
        const user = await User.findOne({ email })

        if (!otpRecord) throw new BadRequestError('OTP not found')
        if (!user) throw new BadRequestError('User not found')

        //2. Check if the OTP is verified
        if (!otpRecord.isVerified) throw new BadRequestError('OTP not verified')

        //3. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword

        await user.save()

        //4. Delete the OTP record
        await ForgotPasswordOTP.deleteOne({ email })

        //5. Exclude password from user
        const { password: hiddenPassword, ...userWithoutPassword } = user.toObject()

        return {
            user: userWithoutPassword
        }
    }

    // static logout = async(keyStore) =>{
    //     const delKey = await KeyTokenService.removeTokenById(keyStore._id)
    //     console.log("delKey: ", delKey)
    //     return delKey
    // }

    // static handlerRefreshToken = async ({keyStore, user, refreshToken}) =>{
    //     const {userId, email} = user
    //     if(keyStore.refreshTokensUsed.includes(refreshToken)){
    //         await KeyTokenService.deleteKeyById(userId)
    //         throw new ForbiddenError('Something wrong happened, Please login again')
    //     }
    //     if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('User not registered')
    //     const foundUser = await findByEmail({email})
    //     if(!foundUser) throw new AuthFailureError('User not registered 2')
    //     //create token pair
    //     const tokens = await createTokenPair(
    //         {userId, email},
    //         keyStore.publicKey,
    //         keyStore.privateKey
    //     )
    //     //update token
    //     await KeyTokenService.updateTokens(tokens, keyStore, refreshToken)
    //     return {
    //         user,
    //         tokens
    //     }
    // }
    static grantAccess(action, resource) {
        return async (req, res, next) => {
            try {
                const userInfo = await User.findById(req.userId).lean()
                const userRole = userInfo.role
                const permission = role.can(userRole)[action](resource)
                if (!permission.granted) {
                    return res.status(401).json({
                        error: "You don't have enough permission to perform this action",
                    })
                }
                next()
            } catch (error) {
                next(error)
            }
        }
    }

}

export default AuthService