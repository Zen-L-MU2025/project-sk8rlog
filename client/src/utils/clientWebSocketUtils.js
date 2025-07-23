import { io } from "socket.io-client";
const { VITE_SERVER_URL } = import.meta.env;
import { CONNECT, DISCONNECT, DELIVER_NOTIFICATION, ENTER_ROOM } from "/src/utils/constants.js";

// Creates a client socket connection to the server and listens for notifications
export const establishWebSocketConnection = (setNotifications, setHasNewNotifications, activeUser) => {
    const socket = io(VITE_SERVER_URL);
    socket.on(CONNECT, async () => {
        await joinUserSocketRoom(socket, activeUser);
    });

    socket.on(DISCONNECT, () => {});

    socket.on(DELIVER_NOTIFICATION, (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setHasNewNotifications(true);
    });

    return socket;
};

// Joins a socket room for a specified user through their ID
export const joinUserSocketRoom = async (socket, activeUser) => {
    if (!socket || !activeUser.userID) {
        return;
    }
    const userID = activeUser.userID;
    await socket.emit(ENTER_ROOM, userID);
};
