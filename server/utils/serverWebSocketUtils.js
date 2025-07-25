import { Server } from "socket.io";
import { CONNECTION, DISCONNECT, ENTER_ROOM, NEW_POST } from "./constants.js";
import notifyUsersWithPost from "./notifications/notifyUsersWithPost.js";

// Creates a websocket server and listens for notification requests
export const createWebSocket = (server, corsConfig) => {
    const socketServer = new Server(server, { connectionStateRecovery: {}, cors: corsConfig });

    socketServer.on(CONNECTION, (socket) => {
        socket.on(DISCONNECT, () => {});

        socket.on(NEW_POST, (post) => {
            notifyUsersWithPost(post, socketServer);
        });

        socket.on(ENTER_ROOM, (userID) => {
            socket.join(`user_${userID}`);
        });
    });

    return socketServer;
};
