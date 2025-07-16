import { io } from 'socket.io-client'
const { VITE_SERVER_URL } = import.meta.env

export const socket = () => {
    const socket = io(VITE_SERVER_URL)
    socket.on('connect', () => {
    })
    socket.on('disconnect', () => {
    })
    return () => { socket.disconnect() }
}
