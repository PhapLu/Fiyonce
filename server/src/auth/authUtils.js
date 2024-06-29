import dotenv from 'dotenv'
dotenv.config()
import JWT from 'jsonwebtoken'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { AuthFailureError, NotFoundError } from '../core/error.response.js'
import KeyTokenService from '../services/keyToken.service.js'
const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN:'x-rtoken-id'
}
const createTokenPair = async (payload, publicKey, privateKey) =>{
    try {
        //accessToken
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '30 days'
        })

        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '30 days'
        })
        JWT.verify(accessToken, publicKey, (error, decode)=>{
            if(error){
                console.error('error verify::', error)
            }else{
                console.log('decode verify::', decode)
            }
        })
        return  { accessToken, refreshToken}
    } catch (error) {
        throw error
    }
}

const allowIfLoggedIn = asyncHandler(async(req, res, next) => {
    const token = req.cookies.accessToken
    if (!token) throw new NotFoundError('Not Found Token')
    JWT.verify(token, process.env.JWT_SECRET, async (error, payload) => {
    if (error) throw new BadRequestError('Token is not valid')
    req.user.userId = payload.userId
    req.user = await User.findById(payload.userId)
    next()
    })
})
const authenticationV2 = asyncHandler(async(req, res, next) => {
    /*
        1 - check userId missing,
        2 - get accessToken,
        3 - verifyToken,
        4 - check user in dbs,
        5 - check KeyStore with this userId
        6 - Ok all => return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')
    //2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found KeyStore')
    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.cookies.accessToken
    if(!accessToken) throw new AuthFailureError('Invalid Request')
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        console.log(decodeUser)
        if(userId !== decodeUser._id) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        req.user = decodeUser
        req.accessToken = accessToken
        console.log('Finish authentication')
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

export{createTokenPair, verifyJWT, authenticationV2, allowIfLoggedIn}