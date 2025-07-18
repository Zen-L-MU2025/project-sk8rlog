import { DELIVER_NOTIFICATION, ROLL_THRESHOLD } from "../constants.js";

// Dummy system: randomly decide whether to send a notification to the client or not
export const rollForNotification = (socket) => {
    if (!socket) {
        console.error("rollForNotification was called with an invalid socket");
        return;
    }

    const number = Math.random();

    const now = new Date().toLocaleTimeString();

    if (number > ROLL_THRESHOLD) {
        socket.emit(DELIVER_NOTIFICATION, now);
    } else {
        // "No new notifications" | Track firing in testing
        // console.log(`Fired at ${now}, ignored`)
    }
};
