import { io } from 'socket.io-client'
const { VITE_SERVER_URL } = import.meta.env

export const socket = () => {
    const socket = io(VITE_SERVER_URL)
    socket.on('connect', () => {
      console.log('user connected')
    })
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
    return () => { socket.disconnect() }
}
