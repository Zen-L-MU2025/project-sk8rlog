import { Server } from "socket.io";
import { CONNECTION, DISCONNECT, ENTER_ROOM, NEW_POST } from "./constants.js";

// Creates a websocket server and listens for notification requests
export const createWebSocket = (server, corsConfig) => {
    const socketServer = new Server(server, { connectionStateRecovery: {}, cors: corsConfig });

    socketServer.on(CONNECTION, (socket) => {
        socket.on(DISCONNECT, () => {});

        socket.on(NEW_POST, () => {
            console.log("request notification received from client");
        });

        socket.on(ENTER_ROOM, (userID) => {
            socket.join(`user_${userID}`);
        });
    });

    return socketServer;
};
