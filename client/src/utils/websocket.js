import { io } from 'socket.io-client'
const { VITE_SERVER_URL } = import.meta.env

export const establishWebSocketConnection = () => {
    const identifier = new Date().getMilliseconds()
    const socket = io(VITE_SERVER_URL)
    socket.on('connect', () => {
    })

    socket.on('disconnect', () => {
    })

    socket.on('deliver notification', (content) => {
        console.log(`Socket ${identifier}: ${content}`)
    })

    periodicPing(socket)
}

const periodicPing = (socket) => {
    const pingInterval = 10000
    setInterval(() => {
        socket.emit('request notification')
    }, pingInterval)
}
