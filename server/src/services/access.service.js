import { User } from "../models/user.model.js"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from "./keyToken.service.js"
import { createTokenPair, verifyJWT } from "../auth/authUtils.js"
import { getInfoData} from '../utils/index.js'
import { findByEmail} from '../utils/index.js'
import {
    AuthFailureError,
    BadRequestError,
    ForbiddenError,
} from "../core/error.response.js";
import Key from "../models/keyToken.model.js"
import role from "../middlewares/role.js"
import jwt from 'jsonwebtoken'
import UserOTPVerification from "../models/UserOTPVerification.js"
import sendEmail from "../middlewares/sendMail.js"
import ForgotPasswordOTP from "../models/forgotPasswordOTP.model.js"
const RoleUser = {
    MEMBER: "member",
    WRITER: "00002",
    EDITOR: "00003",
    ADMIN: "00004",
};

class AccessService{
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
    //     if (!foundUser) throw new BadRequestError("User not registered");
        
    //     // 2. Match password
    //     const match = await bcrypt.compare(password, foundUser.password); // Await the bcrypt comparison
    //     if (!match) throw new AuthFailureError("Authentication error");
        
    //     // 3. Exclude password from foundUser
    //     const { password: hiddenPassword, ...userWithoutPassword } = foundUser;

    //     // 4. Create AccessToken and RefreshToken and save
    //     const privateKey = crypto.randomBytes(64).toString("hex");
    //     const publicKey = crypto.randomBytes(64).toString("hex");
    
    //     // 5. Generate tokens
    //     const { _id: userId } = foundUser;
    //     const tokens = await createTokenPair(
    //         userWithoutPassword,
    //         publicKey,
    //         privateKey
    //     );
    //     await KeyTokenService.createKeyToken({
    //         refreshToken: tokens.refreshToken,
    //         privateKey,
    //         publicKey,
    //         userId
    //     });
    
    //     // 6. Return user data and tokens
    //     return {
    //         user: userWithoutPassword,
    //         tokens
    //     };
    // };
        

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
    //     const { password: hiddenPassword, ...userWithoutPassword } = newUser;
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
    static login = async({email, password}) => {
        // 1. Check email in the database
        const foundUser = await User.findOne({email}).lean()
        if (!foundUser) throw new BadRequestError("User not registered");
        
        // 2. Match password
        const match = await bcrypt.compare(password, foundUser.password); // Await the bcrypt comparison
        if (!match) throw new AuthFailureError("Authentication error");
        
        // 3. Exclude password from foundUser
        
        const token = jwt.sign(
            {
                id: foundUser._id,
                email: foundUser.email
            },
            process.env.JWT_SECRET
        )
        foundUser.accessToken = token
        const { password: hiddenPassword, ...userWithoutPassword } = foundUser;
        return {
            code: 200,
            metadata: {
                user: userWithoutPassword
            }
        }
    }
    
    static signUp = async ({ fullName, email, password }) => {
        // 1. Check if email exists
        const holderUser = await User.findOne({ email }).lean();
        if (holderUser) {
            throw new BadRequestError("Error: User already registered");
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // if(!holderUser){
        //     newUser = await User.create({
        //         fullName,
        //         email,
        //         password: hashedPassword,
        //         role: 'member', // Use the string directly
        //         isVerified: false // Add this field to manage user verification
        //     });
        // }else{
        //     newUser = await User.findOne({ email }).lean();
        // }
        // 3. Check if there is an existing OTP record for the email
        const oldOtp = await UserOTPVerification.findOne({ email}).lean();
        if(oldOtp) await UserOTPVerification.deleteOne({ email });
        // 4. Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // 5. Save OTP in UserOTPVerification collection
        const otpVerification = new UserOTPVerification({
            email,
            password: hashedPassword,
            fullName,
            otp,
            expiredAt: new Date(Date.now() + 30 * 60 * 1000) // OTP expires in 30 minutes
        });
        await otpVerification.save();
        console.log(otpVerification)

        // 6. Send OTP email
        const subject = 'Your OTP Code';
        const message = `Your OTP code for verification is ${otp}`;
        await sendEmail(email, subject, message);

        return {
            code: 201,
            metadata: {
                userId: otpVerification._id,
                email: otpVerification.email
            }
        };
    }

    static verifyOtp = async ({ email, otp }) => {
        // 1. Find the OTP in the database
        const otpRecord = await UserOTPVerification.findOne({ email }).lean();
        if (!otpRecord) {
            throw new BadRequestError('OTP not found');
        }

        // 2. Check if the OTP is expired
        if (otpRecord.expiredAt < new Date()) {
            throw new BadRequestError('OTP has expired');
        }

        // 3. Check if the OTP is correct
        if (otpRecord.otp !== otp) {
            throw new BadRequestError('Incorrect OTP');
        }

        //4. Create user by otpVerification
        const newUser = await User.create({
            fullName: otpRecord.fullName,
            email: otpRecord.email,
            password: otpRecord.password,
            role: 'member', // Use the string directly
        });
        newUser.save()
        // 4. Delete the OTP record
        await UserOTPVerification.deleteOne({ email });

        // 6. Create token
        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email
            },
            process.env.JWT_SECRET
        );

        newUser.accessToken = token;
        await newUser.save();

        const { password: hiddenPassword, ...userWithoutPassword } = newUser.toObject(); // Ensure toObject() is used to strip the password
        return {
            code: 200,
            metadata: {
                user: userWithoutPassword
            }
        };
    }

    static forgotPassword = async ({ email }) => {
        // 1. Find the user by email
        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw new BadRequestError('User not found');
        }

        const oldOtp = await ForgotPasswordOTP.findOne({ email }).lean();
        if(oldOtp) await ForgotPasswordOTP.deleteOne({ email });

        // 2. Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // 3. Save OTP in ForgotPasswordOTP collection
        const forgotPasswordOTP = new ForgotPasswordOTP({
            email,
            otp,
            expiredAt: new Date(Date.now() + 30 * 60 * 1000) // OTP expires in 30 minutes
        });
        await forgotPasswordOTP.save();

        // 4. Send OTP email
        const subject = 'Your OTP Code';
        const message = `Your OTP code for setting new password is ${otp}`;
        await sendEmail(email, subject, message);

        return {
            code: 200,
            metadata: {
                email
            }
        };
    }

    static resetPassword = async({ email, otp, newPassword }) => {
        // 1. Find the OTP in the database
        const otpRecord = await ForgotPasswordOTP.findOne({ email }).lean();
        if (!otpRecord) throw new BadRequestError('OTP not found');
        // 2. Check if the OTP is expired
        if (otpRecord.expiredAt < new Date()) throw new BadRequestError('OTP has expired');

        // 3. Check if the OTP is correct
        if (otpRecord.otp !== otp) throw new BadRequestError('Incorrect OTP');

        // 4. Find the user by email
        const user = await User.findOne({ email });
        if (!user) throw new BadRequestError('User not found');

        // 5. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // 6. Update the user's password
        user.password = hashedPassword;
        await user.save();
        // 7. Create token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET
        );

        user.accessToken = token;
        await user.save();

        const { password: hiddenPassword, ...userWithoutPassword } = user.toObject(); // Ensure toObject() is used to strip the password
        
        // 8. Delete the OTP record
        await ForgotPasswordOTP.deleteOne({ email });

        return {
            code: 200,
            metadata: {
                email,
                user : userWithoutPassword
            }
        };
    }
    // static logout = async(keyStore) =>{
    //     const delKey = await KeyTokenService.removeTokenById(keyStore._id)
    //     console.log("delKey: ", delKey)
    //     return delKey
    // }

    static handlerRefreshToken = async ({keyStore, user, refreshToken}) =>{
        const {userId, email} = user
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened, Please login again')
        }
        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('User not registered')
        const foundUser = await findByEmail({email})
        if(!foundUser) throw new AuthFailureError('User not registered 2')
        //create token pair
        const tokens = await createTokenPair(
            {userId, email},
            keyStore.publicKey,
            keyStore.privateKey
        )
        //update token
        await KeyTokenService.updateTokens(tokens, keyStore, refreshToken);
        return {
            user,
            tokens
        }
    }
    static grantAccess(action, resource) {
        return async (req, res, next) => {
          try {
            const userInfo = await User.findById(req.userId).lean();
            const userRole = userInfo.role;
            const permission = role.can(userRole)[action](resource);
            if (!permission.granted) {
              return res.status(401).json({
                error: "You don't have enough permission to perform this action",
              });
            }
            next();
          } catch (error) {
            next(error);
          }
        };
    }

}

export default AccessService