const express = require('express')
const session = require('express-session')
const cors = require('cors')

const usersRouter = require('./routes/users')

const sessionConfig = {
    name: 'sessionId',
    secret: 'very secret',
    cookie: {
        maxAge: 1000 * 60 * 5,
        secure: process.env.RENDER ? true : false,
        httpOnly: false,
    },
    resave: false,
    saveUninitialized: false,
}

const app = express()

app.use(express.json())
app.use(session(sessionConfig))
app.use(cors())

app.use('/users', usersRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
