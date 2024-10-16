import {getRedis} from '../db/init.redis.js'

const {
    instanceConnect: redisClient
} = getRedis()