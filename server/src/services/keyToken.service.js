import KeyTokenModel from "../models/keyToken.model.js"
import { Types } from "mongoose"
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // const publicKeyString = publicKey.toString()
            // const tokens = await KeyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString
            // })
            //const publicKeyString = publicKey.toString()
            //level 0
            // const tokens = await KeyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            //return tokens ? tokens.publicKey : null
            //level **
            const filter = { user: userId }
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken,
            }
            const options = { upsert: true, new: true }
            const tokens = await KeyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            )

            return tokens ? tokens.publicKey : null
        } catch (error) {
            console.log("Error creating key token:", error)
            return error
        }
    }
    static removeTokenById = async (id) => {
        return await KeyTokenModel.deleteOne({ _id: id })
    }
    static findByUserId = async (userId) => {
        return await KeyTokenModel.findOne({
            user: new Types.ObjectId(userId),
        }).lean()
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await KeyTokenModel.findOne({
            refreshTokensUsed: refreshToken,
        }).lean()
    }
    static deleteKeyById = async (userId) => {
        return await KeyTokenModel.deleteOne({
            user: new Types.ObjectId(userId),
        })
    }
    static findByRefreshToken = async (refreshToken) => {
        return await KeyTokenModel.findOne({ refreshToken }).lean()
    }
    static updateTokens = async (tokens, holderToken, refreshToken) => {
        return await KeyTokenModel.findByIdAndUpdate(holderToken._id, {
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        })
    }
}

export default KeyTokenService
