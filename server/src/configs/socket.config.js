import dotenv from 'dotenv'
dotenv.config()

import { Server } from 'socket.io'

export default function configureSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: [process.env.NODE_ENV == 'production' ? process.env.CLIENT_ORIGIN : process.env.CLIENT_LOCAL_ORIGIN],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Global variable
    global._io = io

    return io;
}
