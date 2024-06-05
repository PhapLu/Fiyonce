class SocketServices {
    // connection socket
    connection(socket) {
        console.log('User connected with id:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected with id:', socket.id);
        });

        // event on here
        socket.on('chat message', msg => {
            console.log(`message is: ${msg}`);
            global.io.emit('chat message', msg);
        });
    }
}

export default new SocketServices();
