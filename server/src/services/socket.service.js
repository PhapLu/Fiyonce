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
    connection(socket) {
        console.log("User connected with id:", socket.id);

        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            global._io.emit("getUsers", users);
            console.log("ADD USER");
            console.log(users);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected with id:", socket.id);
            removeUser(socket.id);
            global._io.emit("getUsers", users);
        });

        socket.on("sendMessage", (newMessage) => {
            console.log(newMessage)
            const receiver = getUser(newMessage.receiverId)

            // console.log(content)
            console.log("SEND MESSAGE")
            console.log(users)

            console.log("RECEIVER INFO")
            console.log(receiver)

            console.log(newMessage.message)

            global._io.to(receiver?.socketId).emit("getMessage", newMessage);
        });

        socket.on("sendTalentRequest", ({ senderId, talentRequest }) => {
            global._io.emit("getTalentRequest", {
                senderId,
                talentRequest,
            });
        });

        socket.on("sendNotification", ({ senderId, receiverId, notification }) => {
            const user = getUser(receiverId)
            console.log(receiverId)
            console.log(notification)
            global._io.to(user?.socketId).emit("getNotification",
                notification,
            )
        })
    }
}

export default new SocketServices();
