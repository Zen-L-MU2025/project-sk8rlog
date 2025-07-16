import { io } from 'socket.io-client'
const { VITE_SERVER_URL } = import.meta.env
import { CONNECT, DISCONNECT, REQUEST_NOTIFICATION, DELIVER_NOTIFICATION } from '/src/utils/constants.js'

export const establishWebSocketConnection = () => {
    const identifier = new Date().getMilliseconds()
    const socket = io(VITE_SERVER_URL)
    socket.on(CONNECT, () => {
    })

    socket.on(DISCONNECT, () => {
    })

    socket.on(DELIVER_NOTIFICATION, (content) => {
        console.log(`Socket ${identifier}: ${content}`)
    })

    periodicPing(socket)
}

const periodicPing = (socket) => {
    const pingInterval = 5000
    setInterval(() => {
        socket.emit(REQUEST_NOTIFICATION)
    }, pingInterval)
}
