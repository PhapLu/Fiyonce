// 'use strict'

// export default client
import dotenv from 'dotenv'
dotenv.config()

import Redis from 'ioredis'
import { RedisErrorResponse } from '../core/error.response.js'

let clients = {}
let statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}
let connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Không thể kết nối đến Redis',
        en: 'Service connection error'
    }
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {

        console.log('Redis connection timeout')
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })

    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({
    connectionRedis
}) => {
    // Check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionIORedis - Connection status: connected')
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionIORedis - Connection status: disconnected')
        //Connect retry
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connectionIORedis - Connection status: reconnecting')
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionIORedis - Connection status: error ${err}`)
        //Connect retry
        handleTimeoutError()
    })
}

const init= ({
    IOREDIS_IS_ENABLED,
}) => {
    if(IOREDIS_IS_ENABLED) {
        const instanceRedis = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        })
        clients.instanceConnect = instanceRedis
        handleEventConnection({
            connectionRedis: instanceRedis
        })
    }
}

const getIORedis = () => clients

const closeIORedis = () => {
    if (clients.instanceConnect) {
        clients.instanceConnect.quit();
        console.log('Redis connection closed.');
    }
};


export {
    init,
    getIORedis,
    closeIORedis
}


