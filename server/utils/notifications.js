import { DELIVER_NOTIFICATION } from "../constants.js"

export const rollForNotification = (socket, identifier) => {
    if (!socket) {
        console.log('roll noti was called with no socket')
        return
    }

    const number = Math.random()

    const now = new Date().toLocaleTimeString()

    if (number > 0.7) {
        socket.emit(DELIVER_NOTIFICATION, `${now}`)
    }
    else {
        console.log(`Socket ${identifier}: no hit at ${now}`)
    }
}
