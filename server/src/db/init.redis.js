// 'use strict'

// export default client
import dotenv from 'dotenv'
dotenv.config()

import redis from 'redis'

let client = {}
const statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}

const handleEventConnect = ({
    connectionRedis
}) => {
    // Check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionRedis - Connection status: connected')
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionRedis - Connection status: disconnected')
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connectionRedis - Connection status: reconnecting')
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: error ${err}`)
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


