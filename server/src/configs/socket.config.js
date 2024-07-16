import dotenv from 'dotenv'
dotenv.config()
import { Server } from 'socket.io'

export default function configureSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: [process.env.ALLOWED_ORIGIN],
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    // Global variable
    global._io = io

    return io
}
