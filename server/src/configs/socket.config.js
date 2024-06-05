import { Server } from 'socket.io';

export default function configureSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "https://vapi.vnappmob.com"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // global variable
    global.io = io;

    return io;
}
