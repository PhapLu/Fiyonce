let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
return users.find((user) => user.userId === userId);
};
class SocketServices {

    // connection socket
    connection(socket) {
        console.log('User connected with id:', socket.id);
        //Take userId and socketId form user
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            global._io.emit("getUsers", users)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected with id:', socket.id);
            removeUser(socket.id)
            global._io.emit('getUsers', users)
        });

        // events on here
        socket.on("sendMessage", ({ senderId, receiverId, text }) => {
            const user = getUser(receiverId);
            global._io.to(user?.socketId).emit("getMessage",{
                senderId,
                text,
            })
          });

        socket.on("sendTalentRequest", ({senderId, receiverId, talentRequest}) => {
            const user = getUser(receiverId);
            global._io.to(user?.socketId).emit("getTalentRequest", {
                senderId,
                talentRequest
            })
        })
    }
}

export default new SocketServices();
