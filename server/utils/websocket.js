import { Server } from 'socket.io'
import { rollForNotification } from './notifications.js'
import { CONNECTION, DISCONNECT, REQUEST_NOTIFICATION } from '../constants.js'

export const createWebSocket = (server, corsConfig) => {
    const identifier = new Date().getMilliseconds()
    const io = new Server(server, { cors: corsConfig })

    io.on(CONNECTION, (socket) => {
        console.log('connected established')

        socket.on(DISCONNECT, () => {
            console.log('connection terminated')
        })

        socket.on(REQUEST_NOTIFICATION, () => {
            rollForNotification(socket, identifier)
        })
    })

    return io
}
