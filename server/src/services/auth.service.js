import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import role from "../middlewares/role.js"
import ForgotPasswordOTP from "../models/forgotPasswordOTP.model.js"
import UserOTPVerification from "../models/userOTPVerification.model.js"
import { User } from "../models/user.model.js"
import { AuthFailureError, BadRequestError } from "../core/error.response.js"
import { createUserQRCode } from "../utils/qrcode.util.js"
import {sendOtpEmail} from "../configs/brevo.email.config.js"
import { trackPlatformAmbassadorBadge } from "../utils/badgeTracking.util.js"

class AuthService {
    static login = async ({ email, password }) => {
        // 1. Check email in the database
        const foundUser = await User.findOne({ email })
        if (!foundUser)
            throw new BadRequestError("Tài khoản chưa được đăng kí")

        // 2. Match password
        const match = await bcrypt.compare(password, foundUser.password) // Await the bcrypt comparison
        if (!match)
            throw new AuthFailureError(
                "Tài khoản hoặc mật khẩu không chính xác"
            )

        // 3. Exclude password from foundUser

        const token = jwt.sign(
            {
                id: foundUser._id,
                email: foundUser.email,
            },
            process.env.JWT_SECRET
        )

        foundUser.accessToken = token
        await foundUser.save()

        const { password: hiddenPassword, ...userWithoutPassword } = foundUser
        return {
            code: 200,
            metadata: {
                user: userWithoutPassword._doc,
            },
        }
    }

    static signUp = async ({ fullName, email, password, referralCode }) => {
        // 1. Check if email exists
        const holderUser = await User.findOne({ email }).lean()
        if (holderUser) throw new BadRequestError("Tài khoản đã tồn tại")

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 3. Check if there is an existing OTP record for the email
        const oldOtp = await UserOTPVerification.findOne({ email }).lean()
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set to the start of the day

        let otp
        let otpVerification
        let lastRequestDate
        if (oldOtp) {
            lastRequestDate = new Date(oldOtp.lastRequestDate)
            lastRequestDate.setHours(0, 0, 0, 0) // Set to the start of the day

            if (lastRequestDate.getTime() === today.getTime()) {
                // Same day request
                if (oldOtp.requestCount >= 10) {
                    throw new BadRequestError(
                        "Số lần gửi yêu cầu của bạn đã vượt quá giới hạn trong ngày"
                    )
                } else {
                    // Increment request count and generate new OTP
                    otp = crypto.randomInt(100000, 999999).toString()
                    otpVerification = await UserOTPVerification.updateOne(
                        { email },
                        {
                            $inc: { requestCount: 1 },
                            $set: {
                                otp,
                                expiredAt: new Date(
                                    Date.now() + 30 * 60 * 1000
                                ),
                                lastRequestDate: new Date(),
                            },
                        }
                    )
                }
            } else {
                // Different day request, reset count and generate new OTP
                otp = crypto.randomInt(100000, 999999).toString()
                otpVerification = await UserOTPVerification.updateOne(
                    { email },
                    {
                        $set: {
                            requestCount: 1,
                            lastRequestDate: new Date(),
                            otp,
                            expiredAt: new Date(Date.now() + 30 * 60 * 1000),
                        },
                    }
                )
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
                lastRequestDate: new Date(),
                referralCode: referralCode,
            })
            await otpVerification.save()
        }

        // 4. Send OTP email
        try {
            const subject = "[Pastal] OTP đăng kí tài khoản"
            const message = `Mã xác thực đăng kí tài khoản của bạn là:`
            const verificationCode = otp
            await sendOtpEmail(email, subject, message, verificationCode)
        } catch (error) {
            console.log("Error sending email:", error)
            throw new BadRequestError("Gửi email không thành công")
        }
        return {
            code: 201,
            metadata: {
                email: otpVerification.email,
            },
        }
    }

    static verifyOtp = async ({ email, otp }) => {
        // 1. Find the OTP in the database
        const otpRecord = await UserOTPVerification.findOne({ email }).lean()

        // 2. Check if the OTP is correct
        if (!otpRecord || otpRecord.otp !== otp) {
            throw new BadRequestError("Mã OTP không chính xác")
        }

        // 3. Check if the OTP is expired
        if (otpRecord.expiredAt < new Date()) {
            throw new BadRequestError("Mã OTP đã hết hạn")
        }

        // 4. Create user by otpVerification
        const newUser = await User.create({
            fullName: otpRecord.fullName,
            email: otpRecord.email,
            password: otpRecord.password,
            role: "member", // Use the string directly
        })

        // 5. Create qrCode and referralCode
        let referral = {}
        const qrCode = await createUserQRCode(newUser._id.toString())
        const referralCode = crypto.randomBytes(4).toString("hex") // Generates 8 characters
        referral.code = referralCode
        referral.referred = []

        newUser.qrCode = qrCode
        newUser.referral = referral
        await newUser.save()


        // 6. Check who is the referrer
        let referrer
        if(otpRecord.referralCode){
            referrer = await User.findOne({ "referral.code": otpRecord.referralCode })
            referrer.referral.referred.push(newUser._id)
            // Track the referrer Badge
            trackPlatformAmbassadorBadge(referrer._id.toString(), "reference")
            await referrer.save()
        }

        //7. Delete the OTP record
        await UserOTPVerification.deleteOne({ email })

        //8. Create token
        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
            },
            process.env.JWT_SECRET
        )

        newUser.accessToken = token
        await newUser.save()

        const { password: hiddenPassword, ...userWithoutPassword } =
            newUser.toObject() // Ensure toObject() is used to strip the password
        return {
            code: 200,
            metadata: {
                user: userWithoutPassword,
            },
        }
    }

    static forgotPassword = async ({ email }) => {
        // 1. Find the user by email
        const user = await User.findOne({ email }).lean()
        if (!user) {
            throw new BadRequestError("Tài khoản chưa được đăng kí")
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
                    throw new BadRequestError(
                        "Số lần gửi yêu cầu của bạn đã vượt quá giới hạn trong ngày"
                    )
                } else {
                    // Increment request count and generate new OTP
                    otp = crypto.randomInt(100000, 999999).toString()
                    await ForgotPasswordOTP.updateOne(
                        { email },
                        {
                            $inc: { requestCount: 1 },
                            $set: {
                                otp,
                                expiredAt: new Date(
                                    Date.now() + 30 * 60 * 1000
                                ),
                                lastRequestDate: new Date(),
                            },
                        }
                    )
                }
            } else {
                // Different day request, reset count and generate new OTP
                otp = crypto.randomInt(100000, 999999).toString()
                await ForgotPasswordOTP.updateOne(
                    { email },
                    {
                        $set: {
                            requestCount: 1,
                            lastRequestDate: new Date(),
                            otp,
                            expiredAt: new Date(Date.now() + 30 * 60 * 1000),
                        },
                    }
                )
            }
        } else {
            // New OTP request
            otp = crypto.randomInt(100000, 999999).toString()
            const forgotPasswordOTP = new ForgotPasswordOTP({
                email,
                otp,
                expiredAt: new Date(Date.now() + 30 * 60 * 1000), // OTP expires in 30 minutes
                requestCount: 1,
                lastRequestDate: new Date(),
            })
            await forgotPasswordOTP.save()
        }

        // 3. Send OTP email
        try {
            const subject = "[Pastal] OTP thay đổi mật khẩu"
            const message = "Mã xác thực thay đổi mật khẩu của bạn là: "
            const verificationCode = otp
            await sendOtpEmail(email,subject,message,verificationCode)
        } catch (error) {
            console.error(error)
            throw new BadRequestError("Gửi email không thành công")
        }

        return {
            code: 200,
            metadata: {
                email,
            },
        }
    }

    static verifyResetPasswordOtp = async ({ email, otp }) => {
        //1. Find, check the OTP and user in the database
        const otpRecord = await ForgotPasswordOTP.findOne({ email })
        const user = await User.findOne({ email })

        // 2. Check if the OTP is correct
        if (!otpRecord || otpRecord.otp !== otp) {
            throw new BadRequestError("Mã OTP không chính xác")
        }
        if (otpRecord.expiredAt < new Date())
            throw new BadRequestError("Mã OTP đã hết hạn")

        if (!user) throw new BadRequestError("")

        //2. Check if the OTP is correct
        if (otpRecord.otp !== otp)
            throw new BadRequestError("Mã OTP không chính xác")

        //3. Mark the otp is verified
        otpRecord.isVerified = true
        otpRecord.save()

        return {
            otpRecord,
        }
    }

    static resetPassword = async ({ email, password }) => {
        //1. Find and check the OTP and user in the database
        const otpRecord = await ForgotPasswordOTP.findOne({ email })
        const user = await User.findOne({ email })

        // 2. Check if the OTP is correct
        if (!otpRecord) {
            throw new BadRequestError("Mã OTP không chính xác")
        }

        if (otpRecord.expiredAt < new Date()) {
            throw new BadRequestError("Mã OTP đã hết hạn")
        }

        if (!user) throw new BadRequestError("Tài khoản chưa được đăng kí")

        //2. Check if the OTP is verified
        if (!otpRecord.isVerified)
            throw new BadRequestError("OTP không hợp lệ")

        //3. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword

        await user.save()

        //4. Delete the OTP record
        await ForgotPasswordOTP.deleteOne({ email })

        //5. Exclude password from user
        const { password: hiddenPassword, ...userWithoutPassword } =
            user.toObject()

        return {
            user: userWithoutPassword,
        }
    }

    static grantAccess(action, resource) {
        return async (req, res, next) => {
            try {
                const userInfo = await User.findById(req.userId).lean()
                const userRole = userInfo.role
                const permission = role.can(userRole)[action](resource)
                if (!permission.granted) {
                    return res.status(401).json({
                        error: "Bạn không có quyền thực hiện thao tác này",
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
