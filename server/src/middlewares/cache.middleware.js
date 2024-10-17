import { CACHE_ORDER, CACHE_USER, CACHE_BADGE, CACHE_NEWS } from '../configs/constant.js';
import { getCacheIO } from '../models/repositories/cache.repo';

const CACHE_PREFIXES = {
    order: CACHE_ORDER.ORDER,
    user: CACHE_USER.USER,
    news: CACHE_NEWS.NEWS,
    badge: CACHE_BADGE.BADGE,
    // Add more types as needed
};

const readCache = (dataType) => async (req, res, next) => {
    const cachePrefix = CACHE_PREFIXES[dataType];
    if (!cachePrefix) {
        console.error(`Unsupported data type: ${dataType}`);
        return next(); // If the data type is unsupported, skip the cache and proceed
    }

    // Automatically detect the ID parameter based on `:xxxId`
    const idParam = Object.keys(req.params).find((key) => key.endsWith('Id'));
    if (!idParam) {
        console.error(`No ID parameter found for data type: ${dataType}`);
        return next();
    }

    const id = req.params[idParam];
    const cacheKey = `${cachePrefix}${id}`;
    let cachedData = await getCacheIO({ key: cacheKey });
    if (!cachedData) return next();

    return res.status(200).json({
        ...JSON.parse(cachedData),
        fromCache: true
    });
};

export { readCache };




// import { CACHE_ORDER } from '../configs/constant.js'
// import { getCacheIO } from '../models/repositories/cache.repo';

// console.log(CACHE_ORDER);
// const readCache = async (req, res, next) => {
//     const {orderId} = req.params
//     const orderKeyCache = `${CACHE_ORDER.ORDER}${orderId}`
//     let orderCache = await getCacheIO({ key: orderKeyCache })
//     if(!orderCache) return next()

//     if(orderCache){
//         return res.status(200).json({
//             ...JSON.parse(orderCache),
//             fromCache: true
//         })
//     }
// }

// export { readCache }