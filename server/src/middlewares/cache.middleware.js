import mongoose from 'mongoose';
import { CACHE_ORDER, CACHE_USER, CACHE_BADGE, CACHE_NEWS } from '../configs/constant.js';
import { getCacheIO } from '../models/repositories/cache.repo.js';

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

const readCacheForMultiple = (dataType) => async (req, res, next) => {
    const cachePrefix = CACHE_PREFIXES[dataType];
    if (!cachePrefix) {
        console.error(`Unsupported data type: ${dataType}`);
        return next(); // Skip the cache and proceed
    }

    const cacheKey = `${cachePrefix}all`; // Use a fixed key for all documents
    let cachedData = await getCacheIO({ key: cacheKey });

    if (!cachedData) {
        return next(); // No cache available, proceed to fetch from the database
    }

    return res.status(200).json({
        data: JSON.parse(cachedData),
        fromCache: true
    });
};

const validation = (dataType) => async (req, res, next) => {
    const idParam = Object.keys(req.params).find((key) => key.endsWith('Id'));
    if (!idParam) {
        console.error(`No ID parameter found for data type: ${dataType}`);
        return next();
    }

    const id = req.params[idParam];
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Proceed with existence check or other logic
    next();
}

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

export { readCache, validation, readCacheForMultiple };