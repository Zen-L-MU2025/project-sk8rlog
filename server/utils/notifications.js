import { DELIVER_NOTIFICATION } from "../constants.js"

// Dummy system: randomly decide whether to send a notification to the client or not
export const rollForNotification = (socket) => {
    if (!socket) {
        console.error('rollForNotification was called with an invalid socket')
        return
    }

    const number = Math.random()

    const now = new Date().toLocaleTimeString()

    if (number > 0.7) {
        socket.emit(DELIVER_NOTIFICATION, now)
    }
    else {
        // "No new notifications"
    }
}
