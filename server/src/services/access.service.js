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

const RoleUser = {
    USER: "00001",
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
    static login = async({email, password, refreshToken = null}) => {
        // 1. Check email in the database
        const foundUser = await findByEmail({email});
        if (!foundUser) throw new BadRequestError("User not registered");
    
        // 2. Match password
        const match = await bcrypt.compare(password, foundUser.password); // Await the bcrypt comparison
        if (!match) throw new AuthFailureError("Authentication error");
    
        // 3. Create AccessToken and RefreshToken and save
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
    
        // 4. Generate tokens
        const { _id: userId } = foundUser;
        const tokens = await createTokenPair(
            { userId, email, role: foundUser.role },
            publicKey,
            privateKey
        );
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        });
    
        // 5. Exclude password from foundUser
        const { password, ...userWithoutPassword } = foundUser;
    
        // 6. Return user data and tokens
        return {
            user: userWithoutPassword,
            tokens
        };
    };
        

    static signUp = async({fullname, email, password}) =>{
        //1. check if email exists?
        const holderUser = await User.findOne({ email }).lean()
        if(holderUser) {
            throw new BadRequestError("Error: User already registered")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            roles: RoleUser.USER
        })
        if(newUser){
            //This is for a giant system like  AMAZON,..., we gonna use 'Crypto' for this
            // created privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding:{
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            //     privatekeyEncoding:{
            //         type: 'pkcs1',
            //         format: 'pem'
            //     }
            // })
            //This is for our web app, it's still good and it is suitable for medium system
            const privateKey = crypto.randomBytes(64).toString("hex")
            const publicKey = crypto.randomBytes(64).toString("hex")
            //Public key cryptoGraphy Standards
            console.log("privateKey: ",privateKey)
            console.log("publicKey: ", publicKey)
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey
            })

            if(!keyStore) {
                throw new BadRequestError("Error: publicKeyString error!")
            }
            //created token pair
            const tokens = await createTokenPair(
                {userId: newUser._id, email, role: newUser.role},
                publicKey,
                privateKey
            )
            console.log("Created Token Success::", tokens);
            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ["_id", "fullname", "email", "role"],
                        object: newUser
                    }),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }

    static logout = async(keyStore) =>{
        const delKey = await KeyTokenService.removeTokenById(keyStore._id)
        console.log("delKey: ", delKey)
        return delKey
    }

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
            const permission = role.can(req.user.role)[action](resource);
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