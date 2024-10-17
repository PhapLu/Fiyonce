import { getIORedis } from "../../db/init.ioredis";
const redisCache = getIORedis().instanceConnect
// // Caching process
// // 1. Check params
// if(order_id < 0) return null
// // 2. Read cache
// const orderKeyCache = `${CACHE_ORDER.ORDER}${order_id}`
// let orderCache = await getCacheIO({ key: orderKeyCache })
// if(orderCache) {
//     return {
//         ...JSON.parse(orderCache),
//         fromCache: true
//     }
// }
// // 3. Read from dbs
// if(!orderCache) {
//     orderCache = await Order.findById(order_id)
//     const valueCache = orderCache ? orderCache : null
//     setCacheIOExpiration({
//         key: orderKeyCache,
//         value: JSON.stringify(valueCache),
//         expirationInSeconds: 30
//     }).then()
//     return {
//         orderCache,
//         fromCache: false
//     }
// }

const setCacheIO = async({
    key, value
}) => {
    if(!redisCache) throw new Error('Redis client not initialized')
    try {
        return await redisCache.set(key, value)
    } catch (error) {
        throw new Error(`${error.message}`)
    }
}

const setCacheIOExpiration = async({
    key, value, expirationInSeconds
}) => {
    if(!redisCache) throw new Error('Redis client not initialized')
    try {
        return await redisCache.set(key, value, 'EX', expirationInSeconds)
    } catch (error) {
        throw new Error(`${error.message}`)
    }
}

const getCacheIO = async({
    key
}) => {
    if(!redisCache) throw new Error('Redis client not initialized')
    try {
        return await redisCache.get(key)
    } catch (error) {
        throw new Error(`${error.message}`)
    }
}

export {
    setCacheIO,
    setCacheIOExpiration,
    getCacheIO
}