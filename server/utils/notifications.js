export const rollForNotification = (socket) => {
    if (!socket) {
        console.log('roll noti was called with no socket')
        return
    }

    const number = Math.random()

    const now = new Date()

    if (number > 0.5) {
        socket.emit('deliver notification', `${now} || Yes!`)
    }
    else {
        socket.emit('deliver notification', `${now} || No!`)
    }
}
