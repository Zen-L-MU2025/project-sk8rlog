import { Server } from "socket.io";
import { CONNECTION, DISCONNECT, REQUEST_NOTIFICATION } from "./constants.js";

// Creates a websocket server and listens for notification requests
export const createWebSocket = (server, corsConfig) => {
    const socketServer = new Server(server, { cors: corsConfig });

    socketServer.on(CONNECTION, (socket) => {
        console.log("socket utils: connection established");

        socket.on(DISCONNECT, () => {
            console.log("socket utils: connection terminated");
        });

        socket.on(REQUEST_NOTIFICATION, () => {
            console.log("request notification received from client");
        });
    });

    return socketServer;
};
