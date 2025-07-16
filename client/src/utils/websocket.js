import { io } from 'socket.io-client'
const { VITE_SERVER_URL } = import.meta.env
import { CONNECT, DISCONNECT, DELIVER_NOTIFICATION } from '/src/utils/constants.js'

// Creates a client socket connection to the server and listens for notifications
export const establishWebSocketConnection = (setDummyNotifications) => {
    // React Strict Mode will create two connections, so we'll give each an arbitrary identifier for visibility
    const identifier = new Date().getMilliseconds()

    const socket = io(VITE_SERVER_URL)
    socket.on(CONNECT, () => {
    })

    socket.on(DISCONNECT, () => {
    })

    socket.on(DELIVER_NOTIFICATION, (content) => {
        const notification = `Notification from socket ${identifier}: ${content}`
        setDummyNotifications((prev) => [...prev, notification])
    })
}
