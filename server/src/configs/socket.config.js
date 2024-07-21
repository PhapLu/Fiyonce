import { Server } from "socket.io";

export default function configureSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const PORT = 8900;
    server.listen(PORT, () => {
        console.log("Socket.IO server is running on port ", PORT);
    });
    // global variable
    global._io = io;

    return io;
}
