import { Server } from 'socket.io'
import { rollForNotification } from './notificationsUtils.js'
import { CONNECTION, DISCONNECT, REQUEST_NOTIFICATION, PING_INTERVAL } from '../constants.js'

// Creates a websocket server and listens for notification requests
export const createWebSocket = (server, corsConfig) => {
    const socketServer = new Server(server, { cors: corsConfig })

    socketServer.on(CONNECTION, (socket) => {
        console.log('connected established')

        socket.on(DISCONNECT, () => {
            console.log('connection terminated')
        })

        socket.on(REQUEST_NOTIFICATION, () => {
            console.log('request notification received from client')
            rollForNotification(socket)
        })

        // Dummy system: periodically ping for a "new notification"
        periodicPing(socket)
    })
}

// Dummy system: Rolls for a notification delivery every PING_INTERVAL ms
const periodicPing = (socket) => {
    setInterval(() => {
        rollForNotification(socket)
    }, PING_INTERVAL)
}
