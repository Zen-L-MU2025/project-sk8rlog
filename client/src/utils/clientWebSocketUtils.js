import { io } from "socket.io-client";
const { VITE_SERVER_URL } = import.meta.env;
import { CONNECT, DISCONNECT, DELIVER_NOTIFICATION, ENTER_ROOM } from "/src/utils/constants.js";

// Creates a client socket connection to the server and listens for notifications
export const establishWebSocketConnection = (setNotifications, setHasNewNotifications, activeUser) => {
    const socket = io(VITE_SERVER_URL);
    socket.on(CONNECT, async () => {
        console.log(`connected at ${new Date().toLocaleTimeString()}`);
        await joinUserSocketRoom(socket, activeUser);
    });

    socket.on(DISCONNECT, () => {
        console.log(`disconnected at ${new Date().toLocaleTimeString()}`);
    });

    socket.on(DELIVER_NOTIFICATION, (content) => {
        const notification = `${content}`;
        setNotifications((prev) => [notification, ...prev]);
        setHasNewNotifications(true);
    });

    return socket;
};

// Joins a socket room for a specified user through their ID
export const joinUserSocketRoom = async (socket, activeUser) => {
    if (!socket || !activeUser.userID) {
        console.log("no socket or activeUser to join room with");
        return;
    }
    const userID = activeUser.userID;
    await socket.emit(ENTER_ROOM, userID);
    console.log(`socket ${socket.id} is now in user_${userID}`);
};
