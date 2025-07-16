import { Server } from 'socket.io'
import { rollForNotification } from './notifications.js'

export const createWebSocket = (server, corsConfig) => {
    const io = new Server(server, { cors: corsConfig })

    io.on('connection', (socket) => {
        console.log('connected established')

        socket.on('disconnect', () => {
            console.log('connection terminated')
        })

        socket.on('request notification', () => {
            rollForNotification(socket)
        })
    })

    return io
}
