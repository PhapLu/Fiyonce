// 'use strict'

// export default client
import dotenv from 'dotenv'
dotenv.config()

import redis from 'redis'
import { RedisErrorResponse } from '../core/error.response.js'

let client = {}
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

const handleEventConnect = ({
    connectionRedis
}) => {
    // Check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionRedis - Connection status: connected')
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionRedis - Connection status: disconnected')
        //Connect retry
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connectionRedis - Connection status: reconnecting')
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: error ${err}`)
        //Connect retry
        handleTimeoutError()
    })
}

const initRedis = () => {
    const instanceRedis = redis.createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    })
    client.instanceConnect = instanceRedis
    handleEventConnect({
        connectionRedis: instanceRedis
    })
    instanceRedis.connect()
    //Test connection
    // const pingRedis = async () => {
    //     try {
    //         const pong = await client.instanceConnect.ping();
    //         console.log('Redis ping response:', pong); // Should output "PONG"
    //     } catch (error) {
    //         console.error('Error pinging Redis:', error);
    //     }
    // };
    
    // // Call this after connecting
    // pingRedis();
    
}

const getRedis = () => client

const closeRedis = () => {
    if (client.instanceConnect) {
        client.instanceConnect.quit();
        console.log('Redis connection closed.');
    }
};


export {
    initRedis,
    getRedis,
    closeRedis
}


